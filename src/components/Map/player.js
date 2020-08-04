import React, {
    useState
} from 'react';
import {
    Fade,
    Card,
    IconButton,
    Typography,
    TextField,
    Slider,
    MenuItem
} from '@material-ui/core';
import {
    useStoreState
} from 'easy-peasy';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { options, formatNumberToHHMMSS } from '../../misc/handlers';

const Player = ({visible, currentTime, endTime, isPlaying, setPlaying, setDelay, handleUpdateTime}) => {
    const { classes } = useStoreState(state => state.classes);
    const [option, setOption] = useState(1000);
    const handleChange = (e) => {
        const { value } = e.target;
        setOption(value);
        setDelay(value);
    }
    const handlePlayControl = (status) => setPlaying(status);
    if (!endTime) return (<></>);
    return (
        <Fade timeout={1000} in={visible}>
            <Card className={classes.player} id="player-div">
            {!isPlaying
            ? <IconButton onClick={() => handlePlayControl(true)}>
                <PlayArrowIcon />
            </IconButton>
            : <IconButton onClick={() => handlePlayControl(false)}>
                <StopIcon />
            </IconButton>
            }
            <Typography variant="caption" style={{height: '48px'}}>
                Скорость
            </Typography>
            <TextField
                select
                value={option}
                defaultValue={option}
                onChange={handleChange}
                style={{width: 'auto', margin: '8px'}}
            >
            {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
            ))}
            </TextField>
            <Slider
                value={currentTime}
                onChange={handleUpdateTime}
                min={0}
                max={endTime || -1}
                getAriaValueText={formatNumberToHHMMSS}
                marks={[
                    {value: currentTime || 0, label: formatNumberToHHMMSS(currentTime || 0)},
                    {value: endTime || -1, label: formatNumberToHHMMSS(endTime || 0)}
                ]}
            />
            </Card>
        </Fade>
    );
}

export default Player;