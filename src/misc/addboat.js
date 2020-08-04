import React, { useState } from 'react';
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TextField,
    DialogActions,
    DialogContentText,
} from '@material-ui/core';
import {useStoreActions, useStoreState} from 'easy-peasy';

import CirclePicker  from 'react-color';
import PaletteIcon from '@material-ui/icons/Palette';

const  AddBoat = ({open, setOpen, data}) => {
    const { setupBoat } = useStoreActions(actions => actions.boats);
    const { updatePlayer } = useStoreActions(actions => actions.player);
    const { classes } = useStoreState(state => state.classes);
    const [color, setColor] = useState("#000");
    const [error, setError] = useState("");
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");

    const cleanState = () => {
        setOpen(false);
        setColor("#000");
        setError("");
        setVisible(false);
        setText("");
    }

    const handleClose = () => {
        cleanState();
    }

    const handleConfirmation = () => {
      if (!text) {
        setError("Задайте имя лодке");
        return;
      }
      if (data) {
        const { obj, player } = data;
        obj.name = text;
        obj.color = color;
        setupBoat(obj);
        updatePlayer(player);
        cleanState();
      }
    }


    const handleColor = (color) => {
        if (!color) return;
        setColor(color.hex);
    }

    return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Загрузка файла</DialogTitle>
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
        error={error ? true : false}
        helperText={error}
        value={text}
      />
      <>
      <Fab
          color="primary"
          className={classes.palette}
          style={{backgroundColor: color}}
          onClick={() => setVisible(!visible)}
      >
          <PaletteIcon />
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

export default AddBoat;