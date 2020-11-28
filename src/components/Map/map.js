import React, {useState, useEffect, useRef} from 'react'
import {Map, Marker, TileLayer, Polyline, ScaleControl, Popup, ZoomControl} from 'react-leaflet'
import {useStoreState, useStoreActions} from 'easy-peasy'
import {calculateAngle} from '../../misc/handlers'
import Wind from './wind'
import North from './north'
import Player from './player'
import {CustomMarker, PinIcon} from '../../misc/graphics';
import {sliceRouteByUTC} from "../../misc/timeservice";

const getFirstMarkerIndex = (currentTime) => {
    return (currentTime >= 50) ? currentTime - 50 : 0
}

export const MapContainer = ({isOnline}) => {
    const {endTime, currentTime, needToSliceRoute, startTime} = useStoreState(state => state.boats)
    const {classes} = useStoreState(state => state.classes)
    const {boats, center} = useStoreState(state => state.boats)
    const {setCurrentTime} = useStoreActions(actions => actions.boats)
    const {setCurrentBoatsSpeed, setCenter} = useStoreActions(actions => actions.boats)
    const [delay, setDelay] = useState(100)
    const [isPlaying, setPlaying] = useState(false)
    const [wind, setWind] = useState(0)

    const {isReady, visible} = useStoreState(state => state.boats)
    const {setIsReady, setVisible} = useStoreActions(actions => actions.boats)

    const {bouys, polyline} = useStoreState(state => state.bouys)
    const {updateBouys, loadBouys} = useStoreActions(actions => actions.bouys)


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
    }, []);


    const updateWindDirection = () => {
        let windDirection = 0
        let wasCouchViewed = false

        boats.forEach(boat => {
            if (boat.data.length > currentTime) {
                if ((boat.data[currentTime].AWA != -1) && (!wasCouchViewed)) {
                    windDirection += boat.data[currentTime].AWA
                    wasCouchViewed = true
                    setIsReady(true)
                }
            } else {
                if ((boat.data[boat.data.length - 1].AWA != -1) && (!wasCouchViewed)) {
                    windDirection += boat.data[boat.data.length - 1].AWA
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

    const updateBoatsAngle = () => {
        const boatDivs = document.getElementsByClassName('boat-div')
        if (!boatDivs || boatDivs.length === 0) return
        boats.forEach((boat, index) => {
            const [svgChild] = [...boatDivs[index].childNodes].filter(child => child.nodeName === 'svg')
            let pos1, pos2 = []
            if (currentTime === 0) {
                pos1 = pos2 = boat.coords[0]
            } else {
                let coordsLen = boat.coords.length - 1
                pos1 = currentTime > coordsLen ? boat.coords[coordsLen] : boat.coords[currentTime - 1]
                pos2 = currentTime > coordsLen ? boat.coords[coordsLen] : boat.coords[currentTime]
            }
            let angle = calculateAngle(pos1, pos2)
            svgChild.style.transform = `rotate(${angle}deg)`
            svgChild.childNodes[3].style.fill = boat.color
        });
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
        ,200)
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
        const {id} = e.target.options
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
            <North/>
            <Wind wind={wind} isReady={isReady}/>
            <Map
                id="leaflet-map"
                center={center}
                useFlyTo={true}
                boundsOptions={{padding: [25, 25]}}
                zoom={13}
                attributionControl={true}
                zoomControl={false}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
            >

                <ZoomControl position="topright"/>
                {markers}
                <Polyline positions={polyline}/>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <ScaleControl position="bottomleft"/>
                {boats.length > 0 && boats.map((boat, idx) =>
                    (boat.currentBoatCoords) ? (
                        <React.Fragment key={idx}>
                            <CustomMarker
                                prevPos={boat.currentBoatCoords}
                                position={boat.currentBoatCoords}
                                color={boat.color}
                                draggable={false}
                            />
                            <Polyline
                                className={classes.polyline}
                                color={boat.color}
                                positions={sliceRouteByUTC(boat, startTime, currentTime)}
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