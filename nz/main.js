
const map = L.map("map", {
    center: [-45.775, 170.727778],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});
console.log(document.querySelector("#map"));
