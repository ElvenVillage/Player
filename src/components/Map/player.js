import React, {
    useState
} from 'react';
import {
    Fade,
    IconButton,
    Typography,
    Slider,
    MenuItem, TextField
} from '@material-ui/core';
import {
    useStoreState
} from 'easy-peasy'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import { options, formatNumberToHHMMSS } from '../../misc/handlers'


const Player = ({visible, currentTime, endTime, isPlaying, setPlaying, setDelay, handleUpdateTime}) => {
    const { classes } = useStoreState(state => state.classes)
    const [option, setOption] = useState(1000)
    const handleChange = (e) => {
        const { value } = e.target
        setOption(value)
        setDelay(value)
    }
    const handlePlayControl = (status) => setPlaying(status)
    if (!endTime) return (<></>)
    return (
        <Fade timeout={1000} in={visible}>
            <div className={classes.player} id="player-div">
                <table><tr><td style={{width: '25px'}}>
            {(!isPlaying)? (<IconButton onClick={() => handlePlayControl(true)}>
                <PlayArrowIcon color={"primary"}/>
            </IconButton>): (<IconButton onClick={() => handlePlayControl(false)}>
                <StopIcon color={"primary"}/>
            </IconButton>)
            }</td><td style={{width: '55px'}}>
            <Typography variant="caption">
                Скорость
            </Typography>
                </td><td style={{width: '55px'}}>
            <TextField
                select
                value={option}
                variant={'filled'}
                color={'primary'}
                defaultValue={option}
                inputProps={{style: {color: 'primary'}}}
                onChange={handleChange}
                style={{width: 'auto'}}
            >
            {options.map(option => (
                <MenuItem key={option.value} value={option.value} style={{backgroundColor: 'black', color: 'white'}}>
                {option.label}
                </MenuItem>
            ))}
            </TextField>
                </td><td style={{width: '600px'}}>
            <Slider
                value={currentTime}
                onChange={handleUpdateTime}
                min={0}
                style={{marginTop: "15px"}}
                max={endTime || -1}
                getAriaValueText={formatNumberToHHMMSS}
                marks={[
                    {value: currentTime || 0, label: formatNumberToHHMMSS(currentTime || 0)},
                    {value: endTime || -1, label: formatNumberToHHMMSS(endTime || 0)}
                ]}
            /></td>
                <td>
                    <Typography variant={"caption"} style={{width: '50px'}}>
                        {formatNumberToHHMMSS(currentTime)}
                    </Typography>
                </td></tr></table>
            </div>
        </Fade>
    );
}

export default Player;