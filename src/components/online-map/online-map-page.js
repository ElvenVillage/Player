import React, { useState, useEffect } from 'react'
import Boats from '../Map/boats'
import Map from '../Map/map'
import FabWrapper from './fabwrapper'
import { Container, Fade, Paper, Grid, Typography, Checkbox } from '@material-ui/core'
import {useStoreActions, useStoreState} from 'easy-peasy'

export const OnlineMapPage = () => {

    const {classes} = useStoreState(state => state.classes)
    const [checked, setChecked] = useState(false)
    const [center, setCenter] = useState([0, 0])

    const {started} = useStoreState(state => state.online)
    const {setStarted} = useStoreActions(actions => actions.online)

    const handleCheckbox = () => setChecked(!checked)

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
            fetch(`http://sail.newpage.xyz/api/get_boat?last=`)
        }, 5000)

        return () => {
            clearInterval(timerIdForBoats)
        }
    }, [])

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
