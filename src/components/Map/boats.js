import React, {useEffect, useState} from 'react'
import {useStoreActions, useStoreState} from 'easy-peasy'
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell, Checkbox, Typography,
} from '@material-ui/core'
import {SketchPicker} from 'react-color'
import LinearProgress from "@material-ui/core/LinearProgress";
import {AllOnTime} from "../../misc/timeservice";

const defaultHeaders = ["#", "Имя лодки", "Цвет"]

export default function Boats() {
    const {boats, loadingFiles, progress} = useStoreState(state => state.boats)
    const {currentTime, needToSliceRoute} = useStoreState(state => state.boats)
    const {selectedHeaders, headers} = useStoreState(state => state.headers)
    const {classes} = useStoreState(state => state.classes)

    const {setCenter, updateBoat} = useStoreActions(actions => actions.boats)
    const {setNeedToSliceRoute} = useStoreActions(actions => actions.boats)
    const [toggledIdx, setToggleIdx] = useState(-1)

    const handleChangeBoat = (e) => {
        const id = e.currentTarget.id
        setCenter(boats[id].coords[0])
    }

    const handleColor = (id, color) => {
        const nBoat = boats[id]
        nBoat.color = color.hex
        updateBoat({id: id, boat: nBoat})
        setToggleIdx(-1)
    }

    const handleCheckbox = (e) => {
        setNeedToSliceRoute(e.target.checked)
    }

    if (!boats || boats.length === 0) return (<></>)


    return (
        <> {
            (loadingFiles) ? <LinearProgress variant="determinate" value={progress}/> : <> </>}
            <Typography component="h4">
                Укорачивать след от лодки
                <Checkbox checked={needToSliceRoute} onChange={handleCheckbox}/>
            </Typography>
            <Table size="small" style={{overflow: "hidden", width: '100%н'}}>
                <>
                    <TableHead>
                        <TableRow>
                            {defaultHeaders.map(header => <TableCell
                                key={defaultHeaders.indexOf(header)}>{header}</TableCell>)}
                            {selectedHeaders.map(header => <TableCell
                                key={selectedHeaders.indexOf(header)}>{header}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boats.map((boat, idx) => (
                            <TableRow className={classes.tableRow} style={{overflow: 'hidden'}} hover={true}
                                      key={idx} onClick={handleChangeBoat}
                                      id={idx}>
                                <TableCell>{boats.indexOf(boat) + 1}</TableCell>
                                <TableCell>{boat.name}</TableCell>
                                <TableCell>
                                    {(toggledIdx === idx) ?
                                        <SketchPicker
                                            className={classes.colorDiv}
                                            color={boat.color}
                                            onChangeComplete={(color) => handleColor(idx, color)}/> : <>
                                            <div className={classes.colorDiv}
                                                 style={{backgroundColor: boat.color}}
                                                 onClick={() => setToggleIdx(idx)}></div>
                                        </>
                                    }
                                </TableCell>

                                {(AllOnTime(boat, currentTime)) ?
                                    Object.values(AllOnTime(boat, currentTime)).slice(4).filter((_, idex) => {
                                        return selectedHeaders.includes(headers[idex])
                                    }).map(r => {
                                        return <TableCell>{r}</TableCell>
                                    }) :
                                    <></>}
                            </TableRow>
                        ))}
                    </TableBody>
                </>
            </Table>
        </>)
}