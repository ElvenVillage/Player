import React, {useCallback} from 'react'
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import {Fab} from '@material-ui/core'
import {useStyles} from "../../styles/styles";
import {useStoreActions} from "easy-peasy";

export const Start = () => {

    const classes = useStyles()
    const { setStarted } = useStoreActions(actions => actions.online)

    const handleClick = useCallback(() => {
        setStarted('true')
    }, [])

    return (

        <Fab
            onClick={handleClick}
            variant="extended"
            color="secondary"
            size="large"
            className={classes.fab}
        >
            <PlayCircleFilledWhiteIcon className={classes.extendedIcon}/>
        </Fab>

    )
}

export default Start