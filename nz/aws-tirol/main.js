let basemapGray = L.tileLayer.provider('BasemapAT.grau')

let map = L.map("map1", {
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

// https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson