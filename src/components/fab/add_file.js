import React, {useRef, useState} from 'react'
import { useStoreState } from 'easy-peasy'
import AddIcon from '@material-ui/icons/Add'
import { Fab } from '@material-ui/core'
import { handleProcessData } from '../../misc/handlers'

import ShowError from '../modals/show_error'
import AddBoat from '../modals/add_boat'

/*
* Fab-кнопка для отображения модального диалога выбора лог-файла (локально)
*/

export const AddFile = () => {
  const { classes } = useStoreState(state => state.classes)
  const inputFile = useRef(null)
  const [open, setOpen] = useState(false)
  const [errorFile, setErrorFile] = useState(false)
  const [data, setData] = useState(null)
  
  const cleanState = () => {
    setOpen(false)
    setErrorFile(false)
    setData(null)
  }
  const handleClick = () => {
    cleanState()
    inputFile.current.click()
  }

  const handleChange = (e) => {
    const [file] = e.target.files
    handleProcessData(file, handleGetData)
  }

  const handleGetData = (data) => {
    if (!data) {
      setErrorFile(true)
      return;
    }
    setOpen(true)
    setData(data);
  }

  return (
  <>
  {/* Файл загружается в input, процессится handleChange и отправляется в компонент AddBoat */}
  <AddBoat open={open} setOpen={setOpen} data={data}  url={false}/>
  <ShowError showError={errorFile} setShowError={setErrorFile} />
  <input
      id="input-file"
      type="file"
      onChange={handleChange}
      accept=".csv,.txt"
      style={{display: "none"}}
      ref={inputFile}
  />
  <Fab
    onClick={handleClick}
    variant="extended"
    color="secondary"
    size="large"
    className={classes.fab}
  >
    <AddIcon className={classes.extendedIcon}/>
    Добавить файл
  </Fab>
  </>
  )
}

export default AddFile