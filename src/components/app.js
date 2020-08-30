import React from 'react'
import {useStyles} from '../styles/styles'
import {useStoreActions} from 'easy-peasy'
import {CssBaseline} from '@material-ui/core'
import MapPage from './Map/map-page'
import OnlineMapPage from "./online-map/online-map-page";

const App = () => {
    const classes = useStyles()
    const {setClasses} = useStoreActions(actions => actions.classes)
    setClasses(classes)
    return (
        <CssBaseline>
            <div className={classes.root}>
                <main className={classes.content}>
                    {(window.location.pathname == '/test/build/')? <MapPage/> : <OnlineMapPage/>}
                </main>
            </div>
        </CssBaseline>
    );
}

export default App
