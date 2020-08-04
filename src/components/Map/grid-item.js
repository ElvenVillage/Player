import React from 'react';
import {Grid, Paper} from '@material-ui/core';
import Title from './title';

export const GridItem = ({md, classes, component, text}) => (
    <Grid item md={md}>
        <Paper className={classes.paper}>
            <Title text={text} />
            {component}
        </Paper>
    </Grid>
);

export default GridItem;
