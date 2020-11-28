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
import {convertBoatTimeToUTC} from "./timeservice";


const AddBoat = ({open, setOpen, data, url}) => {
    const {setupBoat, setCountOfBoats, setCenter} = useStoreActions(actions => actions.boats)
    const {boats} = useStoreState(state => state.boats)
    const {updatePlayer, setIsReady, setCurrentTime} = useStoreActions(actions => actions.boats)
    const {setHeaders} = useStoreActions(actions => actions.headers)
    const {classes} = useStoreState(state => state.classes)
    const [color, setColor] = useState("#000")
    const [urlString, setUrlString] = useState("")
    const [error, setError] = useState("")
    const [visible, setVisible] = useState(false)
    const [text, setText] = useState("")

    const [listOfUrls, setListOfUrls] = useState([])
    const [chosenUrl, setChosenUrl] = useState(-1)

    function findGetParameter(parameterName) {
        let result = null,
            tmp = [];
        window.location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
        return result;
    }

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

    function setNewBoat(data, name = undefined) {
        setHeaders(data.headers)
        const {obj, player} = data

        obj.name = (name) ? name : text
        obj.color = color
        convertBoatTimeToUTC(obj)
        player.endTime = obj.data[player.endTime].UTC
        player.startTime = obj.data[0].UTC

        if (boats.length === 0) {
            setCurrentTime(obj.data[0].UTC)
        }

        setupBoat(obj)
        updatePlayer(player)

        if (obj.data[0].AWA != -1) setIsReady(true)
        setCenter([obj.data[0].LAT, obj.data[0].LON])
        cleanState()
    }

    useEffect(() => {
        const downloadFileList = () => {
            const rid = findGetParameter('race')
            if (!rid) {
                fetch('/files/get_names.php')
                    .then(response => response.json())
                    .then(json => setListOfUrls(json))
                    .catch(e => setListOfUrls([]))
            } else {
                fetch(`/api/show_offline_race_files.php?rid=${rid}`)
                    .then(response => response.json())
                    .then(json => {
                        //setListOfUrls(json)
                        setCountOfBoats(json.length)
                        for (let i = 0; i < json.length; i++) {
                            //if (boats.boats.filter(boat => boat.id == json[i].id).length != 0) return
                            handleProcessData(`/files/get.php?fid=${json[i].fid}`, (data) => {
                                if (data) {
                                    data.color = '#000000'
                                    setNewBoat(data, json[i].fid)
                                }
                            })
                        }
                    }).catch(e => setListOfUrls([]))
            }
        }
        if (url)
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