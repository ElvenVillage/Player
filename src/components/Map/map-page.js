import React, {useEffect, useState} from 'react'
import Boats from './boats'
import Map from './map'
import FabWrapper from './fabwrapper'
import { Container, Fade, Paper, Grid, Typography, Checkbox } from '@material-ui/core'
import { useStoreState } from 'easy-peasy'

export const MapPage = () => {

    const {classes} = useStoreState(state => state.classes)
    const [checked, setChecked] = useState(false)
    const {center} = useStoreState(state => state.boats)

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
                                <Map center={center} isOnline={false}/>
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
                                <Boats checked={checked}/>
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
