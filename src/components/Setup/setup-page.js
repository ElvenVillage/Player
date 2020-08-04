import React, { useState } from 'react';
import {
    Fade,
    Fab,
    Button,
    TextField,
    Grid,
    Paper,
    Container,
    Typography
} from '@material-ui/core';
import {
    useStoreState,
    useStoreActions
} from 'easy-peasy';
import { useHistory } from "react-router";
import CirclePicker  from 'react-color';
import PaletteIcon from '@material-ui/icons/Palette';

const modes = [{
    title: "Загрузка данных в реальном времени",
    params: [{
        id: "url",
        name: "url",
        label: "URL",
    }],
}, {
    title: "Загрузка файла",
    params: [{
        id: "name",
        name: "name",
        label: "Название лодки",
    }, {
        id: "fileName",
        name: "fileName",
        label: "Название файла",
    }, {
        id: "color",
        name: "color",
        label: "Цвет лодки",
    }],
}];

export const WelcomePage = () => {
    const { updateBoat, clearBoatsState } = useStoreActions(actions => actions.boats);
    const { setFileName, clearFileState } = useStoreActions(actions => actions.file); 
    const { changeURL, clearUrlState } = useStoreActions(actions => actions.url);
    const { clearPlayerState } = useStoreActions(actions => actions.player);
    const { fileName } = useStoreState(state => state.file);
    const { classes } = useStoreState(state => state.classes);
    const { boats } = useStoreState(state => state.boats);
    const { url } = useStoreState(state => state.url);
    const history = useHistory()
    const [name, setName] = useState("");
    const [color, setColor] = useState("#000");
    const [text, setText] = useState(url || "");
    const currentMode = !fileName ? 0 : 1;
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState("");

    const handleCleanup = () => {
        clearBoatsState();
        clearFileState();
        clearPlayerState();
        clearUrlState();
        history.push('/')
    }

    const values = {
        url: text,
        name: name,
        fileName: fileName,
    }

    const handleNext = () => {
        if (currentMode === 0) {
            changeURL(text);
            // change the logic below to make a real time fetch
            fetch(text)
            .then(data => {
                console.log(data);
                history.push('/map')
            }).catch(err => {
                console.log(err);
                setError(true);
                setMsg("Не удалось связаться с сервером");
            });
        } else if (currentMode === 1) {
            const boat = boats[0]; // assuming we're setting up at this stage only 1 boat
            const obj = {
                id: 0,
                boat: {
                    ...boat,
                    name: name,
                    color: color,
                }
            }
            updateBoat(obj);
            history.push('/map')
        }
    }

    const handleTextField = (e) => {
        const {value, id} = e.currentTarget;
        switch(id) {
            case "url":
                setError(false);
                setMsg("");
                setText(value);
                break;
            case "name": {
                setName(value);
                break;
            }
            case "fileName": {
                setFileName(value);
                break;
            }
            default: {
                return;
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleNext();
        if (!error) {
        }
    }

    const handleColor = (color) => {
        if (!color) return;
        setColor(color.hex);
    }
    const form = (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                {modes[currentMode].title}
            </Typography>
            <Grid container spacing={3} className={classes.container}>
                {modes[currentMode].params.map(component => (
                    <Grid key={modes[currentMode].params.indexOf(component)} item xs={12}>
                        {component.id === "color"
                        ? (
                            <>
                            <Fab
                                color="primary"
                                style={{backgroundColor: color, minWidth: '64px', minHeight: '64px', maxHeight: '100%', maxWidth: '100%', borderRadius: '50%'}}
                                onClick={() => setVisible(!visible)}
                            >
                                <PaletteIcon />
                            </Fab>
                            {visible ?
                                <div style={{position: 'absolute', marginTop: '10px'}}>
                                    <CirclePicker
                                        name={component.name}
                                        color={color}
                                        onChangeComplete={handleColor}
                                    />
                                </div>
                               
                            : <> </>
                            }
                            
                            </>
                        ) : (
                            <TextField
                                autoFocus={component.id === "name" || component.id === "url" ? true : false}
                                required
                                id={component.id}
                                name={component.name}
                                label={component.label}
                                value={values[component.name]}
                                fullWidth
                                onChange={handleTextField}
                                error={error}
                                helperText={msg}
                            />
                        )}
                    </Grid>
                ))}
            </Grid>
            <div className={classes.buttons}>
                        <Button
                            onClick={handleCleanup}
                            className={classes.button}
                        >
                            Назад
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            type="submit"
                        >
                            Вперёд
                        </Button>
                    </div>
        </form>
    );
    return (
        <Container maxWidth="xl" className={classes.container}>
            <Fade timeout={1000} in={true} mountOnEnter unmountOnExit>
                <Paper className={classes.paper}>
                    {form}
                </Paper>
            </Fade>
        </Container>
    );
}

export default WelcomePage;