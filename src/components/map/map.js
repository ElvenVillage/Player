import React, { useState, useEffect } from 'react'
import { Map, Marker, TileLayer, Polyline, ScaleControl, Popup, ZoomControl } from 'react-leaflet'
import { useStoreState, useStoreActions } from 'easy-peasy'
import Wind from './wind'
import North from './north'
import Player from './player'
import { CustomMarker, PinIcon } from '../../misc/graphics';
import { AWAonTime, HDGonTime, sliceRouteByUTC } from "../../misc/timeservice";


//функция для обрезки отображаемого "хвоста" траектории лодки на карте

const getFirstMarkerIndex = (currentTime, startTime) => {
    return (currentTime - startTime >= 50000) ? currentTime - 50000 : 0
}

export const MapContainer = ({ isOnline }) => {
    const { endTime, currentTime, needToSliceRoute, startTime } = useStoreState(state => state.boats)
    const { classes } = useStoreState(state => state.classes)
    const { boats, center } = useStoreState(state => state.boats)
    const { setCurrentTime } = useStoreActions(actions => actions.boats)
    const { setCurrentBoatsSpeed, setCenter } = useStoreActions(actions => actions.boats)
    const [delay, setDelay] = useState(100)
    const [isPlaying, setPlaying] = useState(false)
    const [wind, setWind] = useState(0)

    const { isReady, visible } = useStoreState(state => state.boats)
    const { setIsReady, setVisible } = useStoreActions(actions => actions.boats)

    const { bouys, polyline } = useStoreState(state => state.bouys)
    const { updateBouys, loadBouys } = useStoreActions(actions => actions.bouys)


    useEffect(() => {
        loadBouys()
        if (boats.length > 0) {
            setCenter([boats[0].data[0].LAT, boats[0].data[0].LON])
            setCurrentTime(boats[0].data[0].UTC)
            updateWindDirection()
        }
        updateDivs()
    }, [boats.length])

    useEffect(() => {
        updateDivs()
        window.addEventListener('resize', updateDivs)
    }, [currentTime, boats]);

    /*
        Информация о ветре берется из файла, содержащего AWA-поле в таблице,
        отличное от -1 (файл тренера)
        */
    const updateWindDirection = () => {
        let windDirection = 0
        let wasCouchViewed = false

        boats.forEach(boat => {
            if (boat.data.length > currentTime) {
                if ((AWAonTime(boat, currentTime) != -1) && (!wasCouchViewed)) {
                    windDirection += AWAonTime(boat, currentTime)
                    wasCouchViewed = true
                    setIsReady(true)
                }
            } else {
                if ((AWAonTime(boat, currentTime) != -1) && (!wasCouchViewed)) {
                    windDirection += AWAonTime(boat, currentTime)
                    wasCouchViewed = true
                    setIsReady(true)
                }
            }
        })
        setWind(windDirection)
        const wind = document.getElementById('wind-div')
        updateDivWidthHeight([wind].filter(val => val !== null))
    }


    const updateDivWidthHeight = (elements) => {
        if (!elements || elements.length === 0) return
        const mapContainer = document.getElementById('leaflet-map')
        const style = window.getComputedStyle(mapContainer)
        elements.forEach(element => {
            if (element.id === "player-div") {
                const width = parseFloat(style.width, 10)
                const height = parseFloat(style.height, 10)
                element.style.width = 0.9 * width + 'px'
                element.style.height = 0.15 * height + 'px'
                element.style.margin = height * 0.15 + 'px ' + 0.05 * width + 'px'
                return
            }
            if (element.id === 'wind-div') {
                const width = parseFloat(style.width, 10)
                const height = parseFloat(style.height, 10)
                //const margin = (height - width) / 2;
                element.style.width = width + 'px'
                element.style.height = 0.1 * height + 'px'
                //element.style.margin = margin + 'px ' + 'auto';
                return
            } else if (element.id === "north-div") {
                const height = parseFloat(style.height, 10)
                element.style.width = style.width
                element.style.height = 0.1 * height + 'px'
                return
            }
            element.style.width = style.width
            element.style.height = style.height
        })
    }
    /*
        Угол поворота лодок на карте определяется HDG-полем
        */
    const updateBoatsAngle = () => {
        const boatDivs = document.getElementsByClassName('boat-div')
        if (!boatDivs || boatDivs.length === 0) return
        for (let index = 0; index < boatDivs.length; index++) {
            const [svgChild] = [...boatDivs[index].childNodes].filter(child => child.nodeName === 'svg')

            let angle = HDGonTime(boats[index], currentTime)

            svgChild.style.transform = `rotate(${angle}deg)`
            svgChild.childNodes[3].style.fill = boats[index].color
        }
    }

    const updateDivs = () => {
        const player = document.getElementById('player-div')
        const north = document.getElementById('north-div')
        const wind = document.getElementById('wind-div')
        const elements = [player, north, wind].filter(val => val !== null)
        updateDivWidthHeight(elements)
        updateBoatsAngle()
    }

    const updateSpeed = (val = currentTime) => {
        const speeds = []
        boats.forEach(boat => {
            const curData = boat.data
            if (curData.length - 1 > val) {
                const speed = Math.round(curData[val].SOG * 100) / 100
                speeds.push(speed)
            } else {
                const speed = Math.round(curData[curData.length - 1].SOG * 100) / 100
                speeds.push(speed)
            }
        })
        setCurrentBoatsSpeed(speeds)
    }

    const handleUpdateTime = (e, val) => {
        setPlaying(false)

        setTimeout(() => {
            setCurrentTime(val)
            updateSpeed(val)
            updateWindDirection()
        }
            , 200)
    }

    useEffect(() => {
        setTimeout(() => {
            if (currentTime >= endTime - 1) {
                setCurrentTime(endTime)
                if (!isOnline)
                    setPlaying(false)
            }
            if (isPlaying) {
                setCurrentTime(currentTime + delay)
                updateSpeed()
                updateWindDirection()
            }
        }, isPlaying ? 200 : null)
    }, [currentTime, isPlaying, delay])


    const OnCreateSetBuiTitle = (id) => {
        if (id == 0) {
            return ('Port')
        }
        if (id == 1) {
            return ('Starboard')
        } else {
            return ('Marker' + (id - 1))
        }
    }

    const handleShowPlayer = (status) => {
        setVisible(status)
    }

    const handleDragEnd = (e) => {
        const { id } = e.target.options
        const latlng = e.target.getLatLng()
        bouys.lats[id] = latlng.lat
        bouys.lngs[id] = latlng.lng
        updateBouys(bouys)
    }


    const markers = bouys.length < 1 && bouys !== null
        ? null
        : (
            <>
                {bouys.lats.map((marker, idx) => (
                    <Marker
                        id={idx}
                        onDragEnd={handleDragEnd}
                        position={[marker, bouys.lngs[idx]]}
                        draggable={true}
                        key={`marker-${idx}`}
                        icon={PinIcon}>
                        <Popup>{OnCreateSetBuiTitle(idx)}</Popup>
                    </Marker>
                ))}
            </>
        );

    return (
        <div onMouseEnter={() => handleShowPlayer(true)}
            onMouseLeave={() => handleShowPlayer(false)}>
            <North />
            <Wind wind={wind} isReady={isReady} />
            <Map
                id="leaflet-map"
                center={center}
                useFlyTo={true}
                boundsOptions={{ padding: [25, 25] }}
                zoom={13}
                attributionControl={true}
                zoomControl={false}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
            >

                <ZoomControl position="topright" />
                {markers}
                <Polyline positions={polyline} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <ScaleControl position="bottomleft" />
                {boats.length > 0 && boats.map((boat, idx) =>
                    (boat.currentBoatCoords) ? (
                        <React.Fragment key={idx}>
                            <CustomMarker
                                position={boat.currentBoatCoords}
                                color={boat.color}
                                draggable={false}
                            />
                            <Polyline
                                className={classes.polyline}
                                color={boat.color}
                                positions={(needToSliceRoute) ? sliceRouteByUTC(boat, getFirstMarkerIndex(currentTime, startTime), currentTime) : sliceRouteByUTC(boat, startTime, currentTime)}
                            />
                        </React.Fragment>) : <></>
                )}
            </Map>
            <Player
                visible={visible}
                currentTime={currentTime}
                endTime={endTime}
                isPlaying={isPlaying}
                setPlaying={setPlaying}
                setDelay={setDelay}
                handleUpdateTime={handleUpdateTime}
                startTime={startTime}
            />
        </div>
    );
}

export default MapContainer