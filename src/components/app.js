import React from 'react';
import {Route, Switch} from 'react-router'
import {BrowserRouter as Router} from 'react-router-dom'
import {useStyles} from '../styles/styles';
import {useStoreActions} from 'easy-peasy';
import {CssBaseline} from '@material-ui/core';
import TopBar from './topbar';
import WelcomePage from './Welcome/welcome-page';
import SetupPage from './Setup/setup-page';
import MapPage from './Map/map-page';
import {LoginPage} from "./Login/login-page";

const App = () => {
    const classes = useStyles();
    const {setClasses} = useStoreActions(actions => actions.classes);
    setClasses(classes);
    return (
        <Router>
            <CssBaseline/>
            <div className={classes.root}>
                <main className={classes.content}>
                    <Switch>
                        <Route path='/login'><LoginPage/></Route>
                        <Route path="/setup"><TopBar classes={classes}/><SetupPage/></Route>
                        <Route path="/map"><TopBar classes={classes}/><MapPage/></Route>
                        <Route path="/"><TopBar classes={classes}/><WelcomePage/></Route>
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;
