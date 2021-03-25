
const map = L.map("map", {
    center: [-45.775, 170.727778],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let mrk = L.marker([-45.775, 170.727778]).addTo(map);
mrk.bindPopup("Taiaroa Head").openPopup();
console.log(document.querySelector("#map"));
