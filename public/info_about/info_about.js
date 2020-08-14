'use strict'

const modes = ['port', 'starboard', 'sign']
let currentMode = 0

const lats = modes.map(mode => document.getElementById(mode + 'Lat'))
const langs = modes.map(mode => document.getElementById(mode + 'Lang'))

const all = [...lats, ...langs]
const map = L.map('mapid').setView([59.939095, 30.315868], 13)

let polyline = {}

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

const updatePolyline = () => {
    if ((markers.portMarker.options) && (markers.starboardMarker.options)) {
        if (polyline.options) {
            polyline.setLatLngs([markers.portMarker.getLatLng(), markers.starboardMarker.getLatLng()])
        } else {
            polyline = L.polyline([markers.portMarker.getLatLng(), markers.starboardMarker.getLatLng()]).addTo(map)
        }
    }
}

const updateDrag = (currentMode) => {
    return () => {
        updatePolyline()

        lats
            .filter(lat => lat.id.includes(modes[currentMode]))
            .forEach(lat => lat.value = markers[modes[currentMode] + 'Marker'].getLatLng().lat)
        langs
            .filter(lang => lang.id.includes(modes[currentMode]))
            .forEach(lang => lang.value = markers[modes[currentMode] + 'Marker'].getLatLng().lng)
    }
}

const getMarker = (target) => {
    const type = modes.filter(mode => target.id.includes(mode))[0]

    return markers[type + 'Marker']
}

const getType = (target) => {
    if (target.id.includes('Lat')) return 'lat'
    if (target.id.includes('Lang')) return 'lng'
}



all.forEach(input => {
    input.addEventListener('change', e => {

        const targetMarker = getMarker(e.target)
        const targetType = getType(e.target)

        updatePolyline()

        if (targetMarker.options) {
            targetMarker.setLatLng(L.latLng(e.target.value, targetMarker.getLatLng()[targetType]))
        } else {
            const latlng = (targetType === 'lat')? L.latLng(e.target.value, 0) : L.latLng(0, e.target.value)

            markers[modes[currentMode] + 'Marker'] = L.marker(latlng, {
                title: modes[currentMode],
                draggable: true
            })
                .addTo(map)
                .bindPopup(modes[currentMode])
                .on('drag', updateDrag(currentMode))

        }
    })
    input.addEventListener('focus', e => {
        currentMode = modes.indexOf(modes.filter(mode => e.target.id.includes(mode))[0])
    })
})

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
    updatePolyline()

    let i = 0
    if (markers.portMarker.options) i++
    if (markers.signMarker.options) i++
    if (markers.starboardMarker.options) i++
    currentMode = i
})
