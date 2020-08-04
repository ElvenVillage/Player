import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContentText,
    DialogContent,
    DialogTitle,
    Button
} from '@material-ui/core';

const ShowError = ({showError, setShowError}) => (
    <Dialog
        open={showError}
        onClose={() => setShowError(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">{"Ошибка чтения файла"}</DialogTitle>
    <DialogContent>
    <DialogContentText id="alert-dialog-description">
        Загруженный вами файл имеет неверную структуру, попробуйте другой файл.
    </DialogContentText>
    </DialogContent>
    <DialogActions>
    <Button onClick={() => setShowError(false)} color="primary" autoFocus>
        ОК
    </Button>
    </DialogActions>
</Dialog>
);

export default ShowError;