import React, {useCallback, useEffect, useState} from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
    DialogContentText,
    List,
    ListItem, ListItemIcon, Checkbox, TextField
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import {useStoreActions, useStoreState} from "easy-peasy";


const Bouys = ({ open, setOpen }) => {

    const { bouys } = useStoreState(state => state.bouys)
    const { updateBouys } = useStoreActions(actions => actions.bouys)

    const [ addMode, setAddMode ] = useState(false)
    const [ appendedLat, setAppendedLat ] = useState('')
    const [ appendedLng, setAppendedLng ] = useState('')

    useEffect(() => {
        const inner = async () => {
            /*
            const resp = await fetch('https://sail.newpage.xyz/api/get_bouys.php')
            const receivedBouys = await resp.json()

            updateBouys(receivedBouys)
             */
        }
        inner()
    }, [])

    const handleClose = useCallback(() => {
        setOpen(false)
        setAddMode(false)
    }, [])

    const handleAdd = useCallback(() => {
        setAddMode(true)
    })

    const handleChangeLat = (e) => {
        setAppendedLat(e.target.value)
    }
    const handleChangeLng = (e) => {
        setAppendedLng(e.target.value)
    }

    const handleChangeGeneralLat = (id, lat) => {
        bouys.lats[id] = lat
        updateBouys({lats: bouys.lats, lngs: bouys.lngs})
    }
    const handleChangeGeneralLng = (id, lng) => {
        bouys.lngs[id] = lng
        updateBouys({lats: bouys.lats, lngs: bouys.lngs})
    }

    const appendBouy = () => {
        updateBouys({
            lats: [...bouys.lats, appendedLat],
            lngs: [...bouys.lngs, appendedLng]
        })
        setAppendedLat('')
        setAppendedLng('')
        setAddMode(false)
    }

    return (
        <Dialog aria-labelledby="form-dialog-title" open={open}>
            <DialogTitle id="form-dialog-title">Просмотр буев</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Список все установленных буев
                </DialogContentText>
                <List>
                    {(bouys && bouys.lats)? bouys.lats.map((lat, idx) => {
                        return (
                            <ListItem key={idx}>
                                <ListItemIcon style={{marginRight: '20px'}}>
                                    <div>{(idx === 0)? 'Port' : ''}
                                        {(idx === 1)? 'Starboard' : ''}
                                        {(idx > 1)? `Marker ${idx-1}` : ''}</div>
                                </ListItemIcon>
                                <TextField value={lat} label='LAT'
                                  onChange={(e) => handleChangeGeneralLat(idx, e.target.value)}/>
                                <TextField value={bouys.lngs[idx]} label='LONG'
                                 onChange={(e) => handleChangeGeneralLng(idx, e.target.value)}/>
                            </ListItem>
                        )
                    }) : ''}
                    {(addMode)? <ListItem>
                        <ListItemIcon style={{position: 'relative', right: '20px'}}
                        onClick={appendBouy}>
                            <div>
                                <CheckIcon style={{position: 'relative', right: '10px', top: '5px'}}
                                 onClick={() => handleAdd()}/>
                                {(bouys.lats.length === 0)? 'Port' : ''}
                                {(bouys.lats.length === 1)? 'Starboard' : ''}
                                {(bouys.lats.length > 1)? `Marker ${bouys.lats.length-1}` : ''}
                            </div>
                        </ListItemIcon>
                        <TextField label='LAT' onChange={handleChangeLat}/>
                        <TextField label='LONG' onChange={handleChangeLng}/>
                    </ListItem> : <></>}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAdd} color="primary">
                Добавить
            </Button>
                <Button onClick={handleClose} color="primary">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Bouys