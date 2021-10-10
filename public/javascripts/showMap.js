mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: hotel.geometry.coordinates,// starting position [lng, lat]
    zoom: 9 // starting zoom
});// Set options

var popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3>${hotel.title}</h3>`)

const marker = new mapboxgl.Marker({
    color: "#dc3545",
    draggable: true
}).setLngLat(hotel.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);