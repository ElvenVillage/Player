import React from 'react'
import {useStoreState} from 'easy-peasy'
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@material-ui/core'

const defaultHeaders = ["#", "Имя лодки", "Цвет", "Текущая скорость"]

export default function Boats({checked, setCenter}) {
    const { boats } = useStoreState(state => state.boats)
    const { currentTime } = useStoreState(state => state.player)
    const { selectedHeaders, headers } = useStoreState(state => state.headers)
    const { classes } = useStoreState(state => state.classes)

    let boatsData = []
    const handleChangeBoat = (e) => {
        const {id} = e.currentTarget
        const {center} = boats[id]
        setCenter(center)
    }

    if (currentTime !== null) {
        boats.forEach(boat => {
            const curData = boat.data
            if (curData.length - 1 > currentTime) {
                boatsData.push(Object.values(curData[currentTime]).slice(4).filter((cell, idx) => {
                    return (selectedHeaders.includes(headers[idx]))
                }))
            } else {
                boatsData.push(Object.values(curData[curData.length - 1]).slice(4).filter((cell, idx) => {
                    return (selectedHeaders.includes(headers[idx]))
                }))
            }
        })
    }

    if (!boats || boats.length === 0) return (<></>)

    return (
        <Table size="small">
            {checked
                ? <>
                    <TableHead>
                        <TableRow>
                            {selectedHeaders.map(header => <TableCell
                                key={selectedHeaders.indexOf(header)}>{header}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boatsData.length > 0 && boatsData.map(boat => (
                            <TableRow className={classes.tableRow} hover={true} key={boatsData.indexOf(boat)}
                                      onClick={handleChangeBoat} id={boatsData.indexOf(boat)}>
                                {boat.map((val, index) => <TableCell key={index}>{val}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </>
                : <>
                    <TableHead>
                        <TableRow>
                            {defaultHeaders.map(header => <TableCell
                                key={defaultHeaders.indexOf(header)}>{header}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boats.map(boat => (
                            <TableRow className={classes.tableRow} style={{overflow: 'hidden'}} hover={true}
                                      key={boats.indexOf(boat)} onClick={handleChangeBoat} id={boats.indexOf(boat)}>
                                <TableCell>{boats.indexOf(boat) + 1}</TableCell>
                                <TableCell>{boat.name}</TableCell>
                                <TableCell>
                                    <div className={classes.colorDiv} style={{backgroundColor: boat.color}}></div>
                                </TableCell>
                                <TableCell>{boat.currentBoatSpeed}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </>
            }
        </Table>
    );
}