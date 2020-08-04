import React from 'react';
import {Route, Switch} from 'react-router'
import {BrowserRouter as Router} from 'react-router-dom'
import {useStyles} from '../styles/styles';
import {
    useStoreState,
    useStoreActions
} from 'easy-peasy';
import {CssBaseline} from '@material-ui/core';
import TopBar from './topbar';
import WelcomePage from './Welcome/welcome-page';
import SetupPage from './Setup/setup-page';
import MapPage from './Map/map-page';

function getActiveMode(mode) {
    switch (mode) {
        case 0:
            return (<WelcomePage/>);
        case 1:
            return (<SetupPage/>);
        case 2:
            return (<MapPage/>);
        default:
            return (<WelcomePage/>);
    }
}

const App = () => {
    const classes = useStyles();
    const {setClasses} = useStoreActions(actions => actions.classes);
    setClasses(classes);
    return (
        <Router>
            <CssBaseline/>
            <div className={classes.root}>
                <main className={classes.content}>
                    <TopBar classes={classes}/>
                    <Switch>
                        <Route path="/setup"><SetupPage/></Route>
                        <Route path="/map"><MapPage/></Route>
                        <Route path="/"><WelcomePage/></Route>
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;
