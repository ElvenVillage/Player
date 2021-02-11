import React from 'react'
import {useStyles} from '../styles/styles'
import {useStoreActions} from 'easy-peasy'
import {CssBaseline} from '@material-ui/core'
import MapPage from './map/map-page'
import OnlineMapPage from "./online-map/online_map_page";

/**
 * Корень приложения, в зависимости от GET-параметра загружает MapPage или OnlineMapPage
 */

const App = () => {
    const classes = useStyles()
    const {setClasses} = useStoreActions(actions => actions.classes)
    setClasses(classes)
    return (
        <CssBaseline>
            <div className={classes.root}>
                <main className={classes.content}>
                    {(window.location.pathname == '/map/')? <MapPage/> : <OnlineMapPage/>}
                </main>
            </div>
        </CssBaseline>
    );
}

export default App
