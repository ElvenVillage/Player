import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
    DialogContentText,
    List,
    ListItem, ListItemIcon, Checkbox
} from '@material-ui/core'
import {useStoreActions, useStoreState} from 'easy-peasy'


const SelectHeaders = ({ open, setOpen }) => {


    const { headers, selectedHeaders } = useStoreState(state => state.headers)
    const { selectHeader } = useStoreActions(state => state.headers)

    const handleClose = () => {
        setOpen(false)
    }

    const handleConfirmation = () => {
        setOpen(false)
    }

    return (
        <Dialog aria-labelledby="form-dialog-title" open={open}>
            <DialogTitle id="form-dialog-title">Выбор параметров отображения</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Необходимо выбрать четыре параметра из представленного списка.
                </DialogContentText>
                <List>
                    {headers.map((header, idx) => {
                        return (
                            <ListItem key={idx}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={selectedHeaders.includes(header)}
                                        onChange={() => selectHeader(header)}
                                    ></Checkbox>
                                </ListItemIcon>
                                {header}
                            </ListItem>
                        )
                    })}
                </List>
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

export default SelectHeaders