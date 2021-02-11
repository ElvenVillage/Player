import React, {
    useState
} from 'react'
import {
    Fade,
    IconButton,
    Typography,
    Slider,
   
} from '@material-ui/core'
import {
    useStoreState
} from 'easy-peasy'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import { options, formatNumberToHHMMSS } from '../../misc/handlers'
import CustomizedInputs from "./dark_text_field"


const Player = ({visible, currentTime, endTime, isPlaying, setPlaying, setDelay, handleUpdateTime, startTime}) => {
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
                <table><tr><td style={{width: '25px', paddingBottom: '12px'}}>
            {(!isPlaying)? (<IconButton onClick={() => handlePlayControl(true)}>
                <PlayArrowIcon color={"primary"}/>
            </IconButton>): (<IconButton onClick={() => handlePlayControl(false)}>
                <StopIcon color={"primary"}/>
            </IconButton>)
            }</td><td style={{width: '55px', paddingBottom: '12px'}}>
            <Typography variant="caption">
                Скорость
            </Typography>
                </td><td style={{width: '55px', paddingBottom: '12px'}}>
            <CustomizedInputs
                options={options}
                value={option}
                handleChange={handleChange}
                style={{width: 'auto'}}
            />
                </td><td style={{width: '600px'}}>
            <Slider
                value={currentTime}
                onChange={handleUpdateTime}
                min={startTime}
                style={{marginTop: "15px"}}
                max={endTime || -1}
                getAriaValueText={formatNumberToHHMMSS}
                marks={[
                    {value: currentTime || 0, label: formatNumberToHHMMSS(currentTime || 0)},
                    {value: endTime || -1, label: formatNumberToHHMMSS(endTime || 0)}
                ]}
            /></td>
                <td style={{paddingBottom: '15px'}}>
                    <Typography variant={"caption"} style={{width: '50px'}}>
                        {formatNumberToHHMMSS(currentTime)}
                    </Typography>
                </td></tr></table>
            </div>
        </Fade>
    );
}

export default Player;