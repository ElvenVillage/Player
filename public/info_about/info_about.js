'use strict'

const modes = ['port', 'starboard']
let currentMode = 0

let lats = []
let langs = []

const map = L.map('mapid').setView([59.939095, 30.315868], 13)

let polyline = {}

const markers = {
    portMarker: {},
    starboardMarker: {}
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    useToFly: true,
    zoomOffset: -1,
}).addTo(map)


const updateDomElements = () => {
    lats = modes.map(mode => document.getElementById(mode + 'Lat'))
    langs = modes.map(mode => document.getElementById(mode + 'Lang'))
}

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

const updateLocalStorage = () => {
    localStorage.setItem('data', JSON.stringify({
        lats: lats.map(lat => lat.value),
        lngs: langs.map(lang => lang.value)
    }))
}

const getMarker = (target) => {
    const type = modes.filter(mode => target.id.includes(mode))[0]

    return markers[type + 'Marker']
}

const getType = (target) => {
    if (target.id.includes('Lat')) return 'lat'
    if (target.id.includes('Lang')) return 'lng'
}


updateDomElements()

const all = [...lats, ...langs]

const addListenerToInput = (input) => {
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
        updateLocalStorage()
        currentMode = modes.indexOf(modes.filter(mode => e.target.id.includes(mode))[0])
    })
}

all.forEach(input => {
    addListenerToInput(input)
})

map.on('dblclick', e => {
    if (currentMode > 1) {
        modes.push('Marker' + (currentMode - 1))

        const div = document.createElement('div')
        div.classList.add('tabs-input__item', 'tabs-input__text3')

        const lang = document.createElement('input')
        lang.type = 'text'
        lang.classList.add('tabs-input__input-lang')
        lang.id = modes[currentMode] + 'Lang'

        const lat = document.createElement('input')
        lat.type = 'text'
        lat.classList.add('tabs-input__input-lat')
        lat.id = modes[currentMode] + 'Lat'

        div.appendChild(lang)
        div.appendChild(lat)

        document.getElementsByClassName('tabs__input')[0].appendChild(div)

        addListenerToInput(lang); addListenerToInput(lat)

        const newMarkerName = document.createElement('div')
        newMarkerName.classList.add('tabs-list__bui2', 'tabs-list__item')
        newMarkerName.innerText = modes[currentMode]
        document.getElementsByClassName('tabs-list__conent')[0].appendChild(newMarkerName)

        updateDomElements()
    }

    markers[modes[currentMode] + 'Marker'] = L.marker(e.latlng, {
        title: modes[currentMode],
        draggable: true
    })
        .addTo(map)
        .bindPopup(modes[currentMode])
        .on('drag', updateDrag(currentMode))

    update(e)
    updatePolyline()
    updateLocalStorage()

    if (!markers.portMarker.options) {
        currentMode = 0
        return
    }
    if (!markers.starboardMarker.options) {
        currentMode = 1
        return
    }

    if ((markers.portMarker.options) && (markers.starboardMarker.options)) {
        currentMode++
    }
})
