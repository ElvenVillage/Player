import React from 'react'
import {
    useStoreState
} from 'easy-peasy'
import Download from './download'
import AddFile from './addfile'
import AddPins from './addpins'
import AddUriLog from './addUrlLog'
import ChangeHeaders from "./changeHeaders"

const FabWrapper = () => {
    const { classes } = useStoreState(state => state.classes);
    return (
    <div className={classes.fabWrapper}>
        <AddPins />
        <ChangeHeaders />
        <AddFile />
        <AddUriLog />
        <Download />
    </div>
    );
}

export default FabWrapper;