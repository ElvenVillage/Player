import React from 'react'
import {
    useStoreState
} from 'easy-peasy'
import ChangeHeaders from "../fab/change_headers"
import ChangeBouysFab from "../fab/change_bouys_fab"

/*
* Панель кнопок, активных при просмотре онлайн-гонки
*/

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