import React, {useState, useEffect, useRef} from 'react'
import {Map, Marker, TileLayer, Polyline, ScaleControl, Popup} from 'react-leaflet'
import {useStoreState, useStoreActions} from 'easy-peasy'
import {useInterval, calculateAngle} from '../../misc/handlers'
import Wind from './wind'
import North from './north'
import Player from './player'
import {CustomMarker, PinIcon} from '../../misc/graphics';

export const MapContainer = ({center, setCenter, isOnline}) => {
    const {endTime, currentTime} = useStoreState(state => state.player)
    const {classes} = useStoreState(state => state.classes)
    const {boats, startLine, isPlacing} = useStoreState(state => state.boats)
    const {setCurrentTime} = useStoreActions(actions => actions.player)
    const {setCurrentBoatsSpeed, setStartLine, updateStartLine} = useStoreActions(actions => actions.boats)
    const [visible, setVisible] = useState(false)
    const [delay, setDelay] = useState(1000)
    const [isPlaying, setPlaying] = useState(false)
    const [wind, setWind] = useState(0)

    const {isReady} = useStoreState(state => state.player)
    const {setIsReady} = useStoreActions(actions => actions.player)
    const mapRef = useRef(null)

    const [ListOfMarkers, setListOfMarkers] = useState([])

    let masslat = []
    let masslng = []

    ///////
    const handleShowPlayer = (status) => setVisible(status);

    useEffect(() => {
        if (boats.length > 0) {
            setCenter(boats[0].center)
            updateWindDirection()
        }
        updateDivs()
    }, [])

    useEffect(() => {
        updateDivs()
        window.addEventListener('resize', updateDivs)
    });

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
        setCurrentTime(val)
        updateSpeed(val)
        updateWindDirection()
    }

    useInterval(() => {
        if (currentTime >= endTime - 1) {
            setCurrentTime(endTime)
            if (!isOnline)
                setPlaying(false)
        }
        setCurrentTime(currentTime + 1)
        updateSpeed()
        updateWindDirection()
    }, isPlaying ? delay : null)

    const handleClick = (e) => {
        const map = mapRef.current
        if (!isPlacing || !map) {
            return
        }
        const {latlng} = e
        const clickedCoords = [latlng.lat, latlng.lng]
        setStartLine(clickedCoords)
    }

    useEffect(() => {
        const OnLoad = () => {
            for (let i = 0; i < masslat.length; i++) {
                console.log("sdfsdfdfdfd")
                console.log(masslat[i], masslng[i])
                setStartLine([masslat[i], masslng[i]]);

                ListOfMarkers.push([masslat[i], masslng[i]])
            }
        }
        /*fetch('http://localhost:8080/markers')
            .then(res => res.json())
            .then(arrayOfMarkers => {
                masslat = arrayOfMarkers.lats
                masslng = arrayOfMarkers.lngs

                OnLoad()
            })

        */

        const arrayOfMarkers = JSON.parse(localStorage.getItem('data'))
        if (!arrayOfMarkers) return
        masslat = arrayOfMarkers.lats
        masslng = arrayOfMarkers.lngs

        OnLoad()

    }, [])


    const OnCreateSetBuiTitle = (id) => {
        if (id == 0) {
            return ('port')
        }
        if (id == 1) {
            return ('starboard')
        } else {
            return ('Marker' + (id-1))
        }
    }
    ////////
    const handleDragEnd = (e) => {
        const {id} = e.target.options
        const latlng = e.target.getLatLng()
        const coords = [latlng.lat, latlng.lng]
        updateStartLine({id, coords})
    }

    const markers = ListOfMarkers.length < 1 && ListOfMarkers !== null
        ? null
        : (
            <>
                {ListOfMarkers.map((marker, idx) => (
                    <Marker
                        id={idx}
                        onDragEnd={handleDragEnd}
                        position={marker}
                        draggable={true}
                        key={`marker-${idx}`}
                        icon={PinIcon} >
                        <Popup>{OnCreateSetBuiTitle(idx)}</Popup>
                    </Marker>
                ))}
                <Polyline className={classes.polyline} color={'black'} positions={startLine}/>
            </>
        );

    return (
        <div
            onMouseEnter={isPlacing ? null : () => handleShowPlayer(true)}
            onMouseLeave={isPlacing ? null : () => handleShowPlayer(false)}
        >
            <North/>
            <Wind wind={wind} isReady={isReady}/>
            <Map
                id="leaflet-map"
                center={center}
                useFlyTo={true}
                boundsOptions={{padding: [25, 25]}}
                zoom={13}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={isPlacing ? false : true}
                animate={true}
                easeLinearity={0.35}
                ref={mapRef}
                onClick={handleClick}
            >
                {markers}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <ScaleControl position="bottomleft"/>
                {boats.length > 0 && boats.map((boat, idx) =>
                    <React.Fragment key={idx}>
                        <CustomMarker
                            prevPos={currentTime === 0 ? boat.coords[0] : boat.coords.length > currentTime ? boat.coords[currentTime - 1] : boat.coords[boat.coords.length - 1]}
                            position={boat.coords.length > currentTime ? boat.coords[currentTime] : boat.coords[boat.coords.length - 1]}
                            color={boat.color}
                            draggable={false}
                        />
                        <Polyline
                            className={classes.polyline}
                            color={boat.color}
                            positions={boat.coords.slice(0, currentTime)}
                        />
                    </React.Fragment>
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
            />
        </div>
    );
}

export default MapContainer