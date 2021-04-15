let basemapGray = L.tileLayer.provider('BasemapAT.grau')

let map = L.map("map", {
center: [47, 11],
zoom: 9,
layers: [
    basemapGray
]
})

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

let awsLayer = L.featureGroup();
layerControl.addOverlay(awsLayer, "Wetterstation Tirol");
awsLayer.addTo(map);

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
            marker.bindPopup(`<h3>${station.properties.name}</h3>`);
            marker.addTo(awsLayer);
        }
    });