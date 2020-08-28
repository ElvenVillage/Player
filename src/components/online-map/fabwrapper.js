import React from 'react'
import {
    useStoreState
} from 'easy-peasy'
import Start from './start'
import Stop from './stop'

const FabWrapper = () => {
    const { classes } = useStoreState(state => state.classes)
    const { started } = useStoreState(state => state.online)

    return (
        <div className={classes.fabWrapper}>
            {(started == 'true') ? <Stop/> : <Start/>}
        </div>
    );
}

export default FabWrapper;