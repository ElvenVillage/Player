import React from 'react';
import {
    useStoreState
} from 'easy-peasy';
import Download from './download';
import AddFile from './addfile';
import AddPins from './addpins';

const FabWrapper = () => {
    const { classes } = useStoreState(state => state.classes);
    return (
    <div className={classes.fabWrapper}>
        <AddPins />
        <AddFile />
        <Download />
    </div>
    );
}

export default FabWrapper;