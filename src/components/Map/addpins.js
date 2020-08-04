import React from 'react';
import {
    useStoreState,
    useStoreActions
} from 'easy-peasy';
import AddIcon from '@material-ui/icons/Add';
import {
    Fab,
} from '@material-ui/core';

export const AddPins = () => {
    const { classes } = useStoreState(state => state.classes);
    const { isPlacing } = useStoreState(state => state.boats);
    const { setPlacing } = useStoreActions(actions => actions.boats);
    const handleSetPlacing = () => {
        setPlacing(!isPlacing);
    }

    return (
    <>
    <Fab
      onClick={handleSetPlacing}
      variant="extended"
      color="secondary"
      size="large"
      className={classes.fab}
    >
      <AddIcon 
        style={{
            transition: 'all 350ms ease-in-out',
            transform: isPlacing ? 'rotate(45deg)' : 'rotate(360deg)'
            }}
        className={classes.extendedIcon}
      />
      Добавить буи
    </Fab>
    </>
    );
}

export default AddPins;