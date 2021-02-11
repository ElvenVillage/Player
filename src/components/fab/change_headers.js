import React, {useCallback, useState} from 'react'
import AddIcon from '@material-ui/icons/Add'
import { Fab } from '@material-ui/core'
import {useStyles} from "../../styles/styles";
import SelectHeaders from '../modals/select_headers'

/*
* Fab-кнопка для вызова модального окна выбора параметров для отображения
* (заголовков таблицы boats.js)
*/

export const ChangeHeaders = () => {

    const classes = useStyles()

    const [open, setOpen] = useState(false)

    const handleClick = useCallback(() => {
        setOpen(true)
    }, [])

    return (
        <>
            <SelectHeaders open={open} setOpen={setOpen}/>
            <Fab
                onClick={handleClick}
                variant="extended"
                color="secondary"
                size="large"
                className={classes.fab}
            >
                <AddIcon className={classes.extendedIcon}/>
                Изменить заголовки
            </Fab>
        </>
    )
}

export default ChangeHeaders