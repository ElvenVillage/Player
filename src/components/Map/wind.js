import React from 'react';
import {
    useStoreState
} from 'easy-peasy';
import {
    Typography,
    Box
} from '@material-ui/core';
import NavigationIcon from '@material-ui/icons/Navigation';

const Wind = ({wind, avgWind}) => {
    const { classes } = useStoreState(state => state.classes);
    if (wind < 0) return (<></>);
    return (
        <Typography component="div" className={classes.windDiv} id="wind-div">
        <Box
            align="right"
            fontSize={20}
            className={classes.windText}
        >
            Ветер
            <div className={classes.arrowsDiv}>
            <NavigationIcon
                className={classes.arrow}
                style={{transform: `rotate(${wind - 180}deg)`}}
            />
            <NavigationIcon
                className={classes.redArrow}
                style={{transform: `rotate(${avgWind - 180}deg)`}}
            />
            </div>
            </Box>
            
        </Typography>
    );
}

export default Wind;