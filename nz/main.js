let stop = {
    nr: 8,
    name: "Taiaroa Head",
    lat: -45.775,
    lng: 170.727778,
    user: "marcelharing",
    wikipedia: "https://en.wikipedia.org/wiki/Taiaroa_Head"
}

console.log(stop);
console.log(stop.name);

const map = L.map("map", {
    center: [stop.lat, stop.lng],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let mrk = L.marker([stop.lat, stop.lng]).addTo(map);
mrk.bindPopup(`
    <h4>Stop ${stop.nr}: ${stop.name}</h4>
    <p><i class="fab fa-wikipedia-w marg_r3"></i><a href="${stop.wikipedia}">Read about stop on Wikipedia</a></p>
    `).openPopup();

//console.log(document.querySelector("#map"));
