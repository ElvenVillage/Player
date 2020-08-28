import React, {useCallback} from 'react'
import StopIcon from '@material-ui/icons/Stop';
import {Fab} from '@material-ui/core'
import {useStyles} from "../../styles/styles";
import {useStoreActions} from "easy-peasy";

export const Stop = () => {

    const classes = useStyles()
    const { setStarted } = useStoreActions(actions => actions.online)

    const handleClick = useCallback(() => {
        setStarted('false')
    }, [])

    return (

        <Fab
            onClick={handleClick}
            variant="extended"
            color="secondary"
            size="large"
            className={classes.fab}
        >
            <StopIcon className={classes.extendedIcon}/>
        </Fab>

    )
}

export default Stop