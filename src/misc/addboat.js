import React, {useEffect, useState, useCallback} from 'react'
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TextField,
    DialogActions,
    DialogContentText,
} from '@material-ui/core'
import {useStoreActions, useStoreState} from 'easy-peasy'

import CirclePicker from 'react-color'
import PaletteIcon from '@material-ui/icons/Palette'
import {handleProcessData} from "./handlers"

const AddBoat = ({open, setOpen, data, url, setData}) => {
    const {setupBoat} = useStoreActions(actions => actions.boats)
    const {updatePlayer} = useStoreActions(actions => actions.player)
    const {setHeaders} = useStoreActions(actions => actions.file)
    const {classes} = useStoreState(state => state.classes)
    const [color, setColor] = useState("#000")
    const [urlString, setUrl] = useState("")
    const [errorFile, setErrorFile] = useState(false)
    const [error, setError] = useState("")
    const [visible, setVisible] = useState(false)
    const [text, setText] = useState("")

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
        cleanState()
    }

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
    }, [text, urlString, data])


    const handleColor = (color) => {
        if (!color) return
        setColor(color.hex)
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
                    <TextField
                        required
                        margin="dense"
                        label="URL"
                        onChange={(e) => {
                            setUrl(e.currentTarget.value)
                        }}
                    /> : ""
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
                                onChangeComplete={handleColor}
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