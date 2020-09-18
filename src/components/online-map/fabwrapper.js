import React from 'react'
import {
    useStoreState
} from 'easy-peasy'
import ChangeHeaders from "../Map/changeHeaders";
import ChangeBouysFab from "../../misc/changeBouysFab";

const FabWrapper = () => {
    const { classes } = useStoreState(state => state.classes)

    return (
        <div className={classes.fabWrapper}>
            <ChangeHeaders/>
            <ChangeBouysFab />
        </div>
    );
}

export default FabWrapper;