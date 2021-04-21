let basemapGray = L.tileLayer.provider('BasemapAT.grau')

//https://leafletjs.com/reference-1.7.1.html#map-l-map >>karte initialisieren
let map = L.map("map", {
center: [47, 11],
zoom: 9,
layers: [
    basemapGray
]
})

// https://leafletjs.com/reference-1.7.1.html#control-layers >>Layercontrol erzeugen
// https://leafletjs.com/reference-1.7.1.html#tilelayer >>Layercontrol wird mit Tilelayer gefüllt, 
// Tilelayererzeugung mit providers extension https://github.com/leaflet-extras/leaflet-providers

let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
    "BasemapAT Orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "Stamen Watercolor": L.tileLayer.provider('Stamen.Watercolor'),
    "OpenTopoMap": L.tileLayer.provider('OpenTopoMap'),
    "BasemapAT overlay": L.tileLayer.provider('BasemapAT.overlay'),
    "Basemap Overlay + Ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])

}).addTo(map)

let awsUrl = 'https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson';

// https://leafletjs.com/reference-1.7.1.html#featuregroup >> Feature Group Layer initialisieren; erweiterte Layer Group
let awsLayer = L.featureGroup();
layerControl.addOverlay(awsLayer, "Wetterstationen Tirol");
// awsLayer.addTo(map); // nicht in Karte darstellen

let snowLayer = L.featureGroup();
layerControl.addOverlay(snowLayer, "Schneehöhen");

let windLayer = L.featureGroup();
layerControl.addOverlay(windLayer, "Windgeschwindigkeiten");

let airLayer = L.featureGroup();
layerControl.addOverlay(airLayer, "Lufttemperatur");
airLayer.addTo(map);


// https://leafletjs.com/reference-1.7.1.html#marker >> Marker mit dazugehörigem Icon auf Karte hinzufügen
// https://leafletjs.com/reference-1.7.1.html#divicon div element als Icon, erbt von Standardicon
fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log('Daten konvertiert: ', json);
        for (station of json.features) {
            console.log('Station: ', station);
            let marker = L.marker([
                station.geometry.coordinates[1],
                station.geometry.coordinates[0]
            ]);
            let formattedDate = new Date(station.properties.date)
            marker.bindPopup(`
            <h3>${station.properties.name}</h3>
            <ul>
                <li>Datum: ${formattedDate.toLocaleString("de")}</li>
                <li>Temperatur: ${station.properties.LT} C°</li>
                <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
                <li>Seehöhe: ${station.geometry.coordinates[2]} Hm </li>
            </ul>
            <a target=" blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);
            marker.addTo(awsLayer);

            // schneehöhen hervorheben
            if (station.properties.HS) {
                let highlightClass = '';
                if (station.properties.HS <= 100) {
                    highlightClass = 'snow-0';
                }
                if (station.properties.HS > 100) {
                    highlightClass = 'snow-100';
                }
                if (station.properties.HS > 200) {
                    highlightClass = 'snow-200';
                }
                let snowIcon = L.divIcon({
                    html: `<div class="snow-air-wind-label ${highlightClass}">${station.properties.HS}</div>`
                })
                let snowMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: snowIcon
                });
                snowMarker.addTo(snowLayer);
            }

            // windgeschwindigkeiten hervorheben
            if (station.properties.WG) {
                let windhighlightClass = '';
                if (station.properties.WG > 2) {
                    windhighlightClass = 'wind-2';
                }
                if (station.properties.WG > 6) {
                    windhighlightClass = 'wind-6';
                }
                let windIcon = L.divIcon({
                    html: `<div class="snow-air-wind-label ${windhighlightClass}">${station.properties.WG}</div>`
                })
                let windMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: windIcon
                });
                windMarker.addTo(windLayer);
            }

            // Lufttemperatur hervorheben
            if (station.properties.LT) {
                let highlightClass = '';
                if (station.properties.LT <= 0) {
                    highlightClass = 'air-u0';
                        }
                if (station.properties.LT > 0) {
                    highlightClass = 'air-a0';
                        }
                let airIcon = L.divIcon({
                    html: `<div class="snow-air-wind-label ${highlightClass}">${station.properties.LT}</div>`
                            })
                let airMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                        ], {
                    icon: airIcon
                        });
                    airMarker.addTo(airLayer);
                        }
        }
        // set map view to all stations
        map.fitBounds(awsLayer.getBounds());
    });