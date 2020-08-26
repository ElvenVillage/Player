import React from 'react'
import {
    useStoreState
} from 'easy-peasy'
import {
    Typography,
    Box
} from '@material-ui/core'
import NavigationIcon from '@material-ui/icons/Navigation'
import CloseIcon from '@material-ui/icons/Close'

const Wind = ({wind, isReady}) => {
    const {classes} = useStoreState(state => state.classes)

    return (
        <Typography component="div" className={classes.windDiv} id="wind-div">
            <Box
                align="right"
                fontSize={20}
                className={classes.windText}
            >
                Ветер
                <div className={classes.arrowsDiv}>
                    {isReady ? <NavigationIcon
                        className={classes.arrow}
                        style={{transform: `rotate(${wind - 180}deg)`}}
                    /> : <CloseIcon className={classes.arrow}/>}

                </div>
            </Box>

        </Typography>
    );
}

export default Wind;