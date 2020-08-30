import React from 'react'
import {
    useStoreState
} from 'easy-peasy'
import Start from './start'
import Stop from './stop'
import ChangeHeaders from "../Map/changeHeaders";

const FabWrapper = () => {
    const { classes } = useStoreState(state => state.classes)
    const { started } = useStoreState(state => state.online)

    return (
        <div className={classes.fabWrapper}>
            {(started == 'true') ? <Stop/> : <Start/>}
            <ChangeHeaders/>
        </div>
    );
}

export default FabWrapper;