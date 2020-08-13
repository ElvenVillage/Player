'use strict'

const modes = ['port', 'starboard', 'sign']
let currentMode = 0

const lats = modes.map(mode => document.getElementById(mode + 'Lat'))
const langs = modes.map(mode => document.getElementById(mode + 'Lang'))

const all = [lats, langs]
const map = L.map('mapid').setView([59.939095, 30.315868], 13)

const markers = {
    portMarker: {},
    starboardMarker: {},
    signMarker: {}
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    useToFly: true,
    zoomOffset: -1,
}).addTo(map)


const update = (e) => {
    lats.filter(lat => lat.id.includes(modes[currentMode])).forEach(lat => lat.value = e.latlng.lat)
    langs.filter(lang => lang.id.includes(modes[currentMode])).forEach(lang => lang.value = e.latlng.lng)
}

const updateDrag = (currentMode) => {
    return () => {
        lats
            .filter(lat => lat.id.includes(modes[currentMode]))
            .forEach(lat => lat.value = markers[modes[currentMode] + 'Marker'].getLatLng().lat)
        langs
            .filter(lang => lang.id.includes(modes[currentMode]))
            .forEach(lang => lang.value = markers[modes[currentMode] + 'Marker'].getLatLng().lng)
    }
}

map.on('dblclick', e => {
    if (currentMode > 2) return

    markers[modes[currentMode] + 'Marker'] = L.marker(e.latlng, {
        title: modes[currentMode],
        draggable: true
    })
        .addTo(map)
        .bindPopup(modes[currentMode])
        .on('drag', updateDrag(currentMode))

    update(e)

    currentMode++
})
