import React, {useEffect, useState, useCallback} from 'react'
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TextField,
    DialogActions,
    DialogContentText, List, ListItemAvatar,
} from '@material-ui/core'
import {useStoreActions, useStoreState} from 'easy-peasy'

import CirclePicker from 'react-color'
import PaletteIcon from '@material-ui/icons/Palette'
import {handleProcessData} from "./handlers"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"

const AddBoat = ({open, setOpen, data, url, setData}) => {
    const {setupBoat} = useStoreActions(actions => actions.boats)
    const {updatePlayer, setIsReady} = useStoreActions(actions => actions.player)
    const {setHeaders} = useStoreActions(actions => actions.headers)
    const {classes} = useStoreState(state => state.classes)
    const [color, setColor] = useState("#000")
    const [urlString, setUrlString] = useState("")
    const [error, setError] = useState("")
    const [visible, setVisible] = useState(false)
    const [text, setText] = useState("")

    const [listOfUrls, setListOfUrls] = useState([])
    const [chosenUrl, setChosenUrl] = useState(-1)

    const cleanState = () => {
        setOpen(false)
        setColor("#000")
        setError("")
        setVisible(false)
        setText("")
    }

    const handleClose = () => {
        cleanState()
    }

    function setNewBoat(data) {
        setHeaders(data.headers)
        const {obj, player} = data
        obj.name = text
        obj.color = color
        setupBoat(obj)
        updatePlayer(player)

        if (obj.data[0].AWA != -1) setIsReady(true)
        cleanState()
    }

    const downloadFileList = async () => {
        const response = await fetch('/files/get_names.php')
        try {
            const json = await response.json()
            setListOfUrls(json)
        } catch (e) {
            setListOfUrls([])
        }
    }

    useEffect(() => {
        downloadFileList()
    }, [])

    const handleConfirmation = useCallback(() => {
        if (!text) {
            setError("Задайте имя лодке");
            return;
        }
        if (!url) {
            if (data) {
                setNewBoat(data)
            }
        } else {

            handleProcessData(urlString, (data) => {
                if (data) setNewBoat(data)
            })

        }
    }, [text, urlString, data, color])


    const handleColor = (color) => {
        if (!color) return
        setColor(color.hex)
    }

    const download = (idx) => {
        setUrlString(`/files/get.php?fid=${listOfUrls[idx].id}`)
        setChosenUrl(idx)
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{url ? 'Укажите URL log-файла' : 'Загрузка файла'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Чтобы добавить данные для отображения, осталось настроить цвет и имя лодки.
                </DialogContentText>
                <TextField
                    required
                    autoFocus
                    margin="dense"
                    onChange={(e) => setText(e.currentTarget.value)}
                    id="name"
                    label="Имя лодки"
                    type="email"
                    fullWidth
                    error={!!error}
                    helperText={error}
                    value={text}
                />
                {url ?
                    <>
                        <List>
                            {listOfUrls ? listOfUrls.map((fileUrl, idx) => {
                                return (
                                    <ListItem style={(idx === chosenUrl) ? {
                                        backgroundColor: "blue"
                                    } : {backgroundColor: "white"}
                                    } onClick={() => download(idx)}>
                                        <ListItemAvatar>
                                            <div>{fileUrl.name}</div>
                                        </ListItemAvatar>
                                        <ListItemText primary={fileUrl.title}
                                                      secondary={fileUrl.description}/>
                                    </ListItem>
                                )
                            }) : <></>}
                        </List>
                        <TextField
                            required
                            margin="dense"
                            label="URL"
                            onChange={(e) => {
                                setUrlString(e.currentTarget.value)
                            }}
                        />
                    </> : ""
                }
                <>
                    <Fab
                        color="primary"
                        className={classes.palette}
                        style={{backgroundColor: color}}
                        onClick={() => setVisible(!visible)}
                    >
                        <PaletteIcon/>
                    </Fab>
                    {visible ?
                        <div style={{position: 'fixed', marginTop: '10px', zIndex: '1'}}>
                            <CirclePicker
                                color={color}
                                onChangeComplete={(color) => handleColor(color)}
                            />
                        </div>

                        : <> </>
                    }
                </>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Закрыть
                </Button>
                <Button onClick={handleConfirmation} color="primary">
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddBoat