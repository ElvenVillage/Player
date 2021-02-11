import React from 'react'
import {
    useStoreState
} from 'easy-peasy'
import Download from '../fab/download'
import AddFile from '../fab/add_file'
import AddUriLog from '../fab/add_url_log'
import ChangeHeaders from "../fab/change_headers"
import {ChangeBouysFab} from "../fab/change_bouys_fab"

/*
/ Панель с набором кнопок, активных для использования при локальном просмотре 
* или при скачивании отдельных файлов с сайта.
*/

const FabWrapper = () => {
    const { classes } = useStoreState(state => state.classes);
    return (
    <div className={classes.fabWrapper}>
        <ChangeHeaders />
        <AddFile/>
        <AddUriLog />
        <Download />
        <ChangeBouysFab />
    </div>
    );
}

export default FabWrapper;