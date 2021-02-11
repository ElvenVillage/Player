import React, { useState, useEffect } from 'react'
import Boats from '../map/boats'
import Map from '../map/map'
import FabWrapper from './fabwrapper'
import { Container, Fade, Paper, Grid, Typography } from '@material-ui/core'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { filterData } from "../../misc/handlers"
import {findGetParameter} from '../../misc/handlers'

/*
* MapPage +  обновляет данные с сервера и отображает другую панель кнопок
*/

export const OnlineMapPage = () => {

    const { classes } = useStoreState(state => state.classes)

    const { setStarted, updateLastSeemed } = useStoreActions(actions => actions.online)
    const { setupBoat, appendDataToBoat } = useStoreActions(actions => actions.boats)
    const { setHeaders } = useStoreActions(actions => actions.headers)
    const { updatePlayer } = useStoreActions(actions => actions.boats)

    const { endTime } = useStoreState(state => state.boats)

    const { lastSeemed } = useStoreState(state => state.online)

    const [boats, setBoats] = useState([])

    const getLastId = (array) => {
        return array[array.length - 1].id
    }
    //Основная функция, заполняющая js-объекты лодок данными из формата сервера
    //Аналогична add_boat.js, но не заменяет всю таблицу целиком.
    const updateBoatsFromJson = (serverArray, id) => {

        updateLastSeemed({ id: id, value: getLastId(serverArray) })

        filterData({ data: serverArray }, (data) => {
            setHeaders(data.headers)
            const { obj, player } = data
            player.endTime += endTime
            appendDataToBoat({ id: 0, append: obj.data })
            updatePlayer(player)
        })
    }



    //Инициализация лодок стартовыми параметрами
    useEffect(() => {
        let rid = findGetParameter('race')
        fetch(`https://sail.newpage.xyz/api/race_members.php?${(rid) ? 'rid=' + rid : ''}`)
            .then(res => res.json())
            .then(json => {
                json.forEach(js => {
                    setBoats([...boats, js.id])
                    boats.push(js.id)

                    updateLastSeemed({ id: js.id, value: 0 })
                    fetch(`https://sail.newpage.xyz/api/get_online_race.php?lastid=0&uid=${js.id}`)
                        .then(boatRes => boatRes.json())
                        .then(boatJson => {
                            filterData({ data: boatJson }, (data) => {
                                setHeaders(data.headers)
                                const { obj, player } = data
                                obj.name = js.name
                                obj.color = js.color
                                setupBoat(obj)
                                updatePlayer(player)
                            })
                        })
                })
            })
    }, [])


    //периодические обновления

    useEffect(() => {
        const timerIdForBoats = setInterval(() => {
            boats.forEach(boatID => {
                fetch(`https://sail.newpage.xyz/api/get_online_race.php?lastid=${lastSeemed[parseInt(boatID)]}&uid=${boatID}`)
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
                                <Map isOnline={true} />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper className={classes.paper}>
                                <Typography component="h2" variant="h6">
                                    Лодки
                                </Typography>
                                <Typography variant="subtitle1" style={{ display: "inline" }}>
                                    Показать все столбцы

                                </Typography>
                                <Boats />
                            </Paper>
                        </Grid>
                    </Grid>
                    <FabWrapper />
                </>
            </Fade>
        </Container>
    )
}

export default OnlineMapPage
