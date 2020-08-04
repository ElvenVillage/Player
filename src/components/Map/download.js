import React from 'react';
import {useStoreState} from 'easy-peasy';
import SaveIcon from '@material-ui/icons/Save';
import Papa from 'papaparse';
import {Fab} from '@material-ui/core';

export const Download = () => {
    const { boats } = useStoreState(state => state.boats);
    const { fileName } = useStoreState(state => state.file);
    const { classes } = useStoreState(state => state.classes);
    const handleExport = (e) => {
      e.preventDefault();
      if (!boats || boats.length === 0) return;
      const data = boats.flatMap(boat => boat.data)
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], {type: "application/vnd.ms-excel"});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
    }
    return (
      <>
      {!boats || boats.length === 0 ? 
      <></> 
      : 
      <Fab
        onClick={handleExport}
        variant="extended"
        color="primary"
        size="large"
        className={classes.fab}
        disabled={!boats || boats.length === 0 ? true : false}
      >
        <SaveIcon className={classes.extendedIcon}/>
        Скачать
      </Fab>
      }
      </>
      );
}

export default Download;