import React, {useCallback, useState} from 'react'
import AddIcon from '@material-ui/icons/Add'
import { Fab } from '@material-ui/core'
import {useStyles} from "../styles/styles";
import Bouys from "../components/Map/bouys";

export const ChangeBouysFab = () => {

    const classes = useStyles()

    const [open, setOpen] = useState(false)

    const handleClick = useCallback(() => {
        setOpen(true)
    }, [])

    return (
        <>
            <Bouys open={open} setOpen={setOpen}/>
            <Fab
                onClick={handleClick}
                variant="extended"
                color="secondary"
                size="large"
                className={classes.fab}
            >
                <AddIcon className={classes.extendedIcon}/>
                Отобразить буи
            </Fab>
        </>
    )
}

export default ChangeBouysFab