import React, { useState, useEffect } from 'react'
import Boats from './boats'
import Map from './map'
import FabWrapper from './fabwrapper'
import { Container, Fade, Paper, Grid, Typography, Checkbox } from '@material-ui/core'
import {useStoreActions, useStoreState} from 'easy-peasy'
import { handleProcessData } from "../../misc/handlers";

export const MapPage = () => {

    const { setFileName, setHeaders, clearFileState } = useStoreActions(actions => actions.file)
    const {classes} = useStoreState(state => state.classes)
    const [loading, setLoading] = useState(false)
    const [showError, setShowError] = useState(false)
    const { setupBoat, clearBoatsState } = useStoreActions(actions => actions.boats)
    const { setPlayer, clearPlayerState } = useStoreActions(actions => actions.player)
    const [checked, setChecked] = useState(false)
    const [center, setCenter] = useState([0, 0])

    const handleCheckbox = () => setChecked(!checked)

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

export default MapPage
