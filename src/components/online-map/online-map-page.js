import React, {useState, useEffect} from 'react'
import Boats from '../Map/boats'
import Map from '../Map/map'
import FabWrapper from './fabwrapper'
import {Container, Fade, Paper, Grid, Typography, Checkbox} from '@material-ui/core'
import {useStoreActions, useStoreState} from 'easy-peasy'
import {filterData} from "../../misc/handlers";

export const OnlineMapPage = () => {

    const {classes} = useStoreState(state => state.classes)
    const [checked, setChecked] = useState(false)
    const [center, setCenter] = useState([0, 0])

    const {setStarted} = useStoreActions(actions => actions.online)
    const {setupBoat, appendDataToBoat} = useStoreActions(actions => actions.boats)
    const {setHeaders} = useStoreActions(actions => actions.headers)
    const {updatePlayer} = useStoreActions(actions => actions.player)

    const {endTime} = useStoreState(state => state.player)

    const [lastSeemed, setLastSeemed] = useState({})

    const handleCheckbox = () => setChecked(!checked)
    const [boats, setBoats] = useState([])

    const updateBoatsFromJson = (serverArray, id) => {
        let tmp = {}
        for (let key in lastSeemed) {
            tmp[key] = (key == id)? lastSeemed[key] + 1 : lastSeemed[key]
        }

        setLastSeemed(tmp)
        filterData({data: serverArray}, (data) => {
            setHeaders(data.headers)
            const {obj, player} = data
            player.endTime += endTime
            appendDataToBoat({id: 0, append: obj.data})
            updatePlayer(player)
        })
    }

    //Инициализация лодок стартовыми параметрами
    useEffect(() => {
        fetch('http://localhost:8080/listOfBoats')
            .then(res => res.json())
            .then(json => {
                json.forEach(js => {
                    setBoats([...boats, js.id])
                    boats.push(js.id)

                    lastSeemed[js.id] = 0
                    setLastSeemed(lastSeemed)
                    fetch(`http://localhost:8080/index?last=0&id=${js.id}`)
                        .then(boatRes => boatRes.json())
                        .then(boatJson => {
                            filterData({data: boatJson}, (data) => {
                                setHeaders(data.headers)
                                const {obj, player} = data
                                obj.name = js.name
                                obj.color = js.color
                                setupBoat(obj)
                                updatePlayer(player)
                            })
                        })
                })
            })
    }, [])



    useEffect(() => {
        const timerIdForStarted = setInterval(() => {
            fetch('http://sail.newpage.xyz/api/started.php')
                .then(res => res.text())
                .then(resp => {
                    setStarted(resp)
                })
        }, 5000)

        return () => {
            clearInterval(timerIdForStarted)
        }
    }, [])

    useEffect(() => {
        const timerIdForBoats = setInterval(() => {
            boats.forEach(boatID => {
                fetch(`http://localhost:8080/index?last=${lastSeemed[parseInt(boatID)]}&id=${boatID}`)
                    .then(res => res.json())
                    .then(resp => updateBoatsFromJson(resp, boatID))
            })
        }, 5000)

        return () => {
            clearInterval(timerIdForBoats)
        }
    }, [endTime, boats, lastSeemed])

    return (
        <Container maxWidth="xl" className={classes.mapContainer}>
            <Fade timeout={1000} in={true} mountOnEnter unmountOnExit>
                <>
                    <Grid container spacing={2} className={classes.map}>
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                <Typography component="h2" variant="h6" gutterBottom>
                                    Карта
                                </Typography>
                                <Map center={center} setCenter={setCenter}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper className={classes.paper}>
                                <Typography component="h2" variant="h6">
                                    Лодки
                                </Typography>
                                <Typography variant="subtitle1" style={{display: "inline"}}>
                                    Показать все столбцы
                                    <Checkbox checked={checked} onChange={handleCheckbox}/>
                                </Typography>
                                <Boats checked={checked} setCenter={setCenter}/>
                            </Paper>
                        </Grid>
                    </Grid>
                    <FabWrapper/>
                </>
            </Fade>
        </Container>
    )
}

export default OnlineMapPage
