import React from 'react';
import {
    useStoreState
} from 'easy-peasy';
import {
    Typography,
    Box,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const North = () => {
    const { classes } = useStoreState(state => state.classes);
    return (
        <Typography component="div" className={classes.northDiv} id="north-div">
            <Box
                align="center"
                fontWeight="fontWeightBold"
                fontSize={20}
                className={classes.northText}
            >
                <ExpandLessIcon
                    className={classes.northIcon}
                    fontSize="large"
                />
                N
            </Box>
        </Typography>
    );
}

export default North;
