import React, {useRef, useState} from 'react'
import { useStoreState } from 'easy-peasy'
import AddIcon from '@material-ui/icons/Add'
import { Fab } from '@material-ui/core'
import { handleProcessData } from '../../misc/handlers'

import ShowError from '../../misc/showerror'
import AddBoat from '../../misc/addboat'

export const AddUriLog = () => {
    const { classes } = useStoreState(state => state.classes)
    const inputFile = useRef(null)
    const [open, setOpen] = useState(false)
    const [errorFile, setErrorFile] = useState(false)
    const [data, setData] = useState(null)

    const cleanState = () => {
        setOpen(false)
        setErrorFile(false)
        setData(null)
    }
    const handleClick = () => {
        cleanState()
        setOpen(true)
    }

    return (
        <>
            <AddBoat open={open} setOpen={setOpen} data={data} url={true} setData={setData} />
            <ShowError showError={errorFile} setShowError={setErrorFile} />
            <Fab
                onClick={handleClick}
                variant="extended"
                color="secondary"
                size="large"
                className={classes.fab}
            >
                <AddIcon className={classes.extendedIcon}/>
                Добавить URL log
            </Fab>
        </>
    )
}

export default AddUriLog