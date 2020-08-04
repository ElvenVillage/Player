import React, {
    useState,
    useRef,
    useEffect
} from 'react';
import {
    Fade,
    CircularProgress,
    Button,
    Grid,
    Paper,
    Container,
} from '@material-ui/core';
import {
    useStoreActions,
    useStoreState
} from 'easy-peasy';
import { useHistory } from 'react-router-dom'
import ShowError from '../../misc/showerror';

import { handleProcessData } from '../../misc/handlers';

export const WelcomePage = () => {
    const { setFileName, setHeaders, clearFileState } = useStoreActions(actions => actions.file);
    const { setupBoat, clearBoatsState } = useStoreActions(actions => actions.boats);
    const { setPlayer, clearPlayerState } = useStoreActions(actions => actions.player);
    const { clearUrlState } = useStoreActions(actions => actions.url);
    const { classes } = useStoreState(state => state.classes);
    const history = useHistory()
    const [isLoading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const inputFile = useRef(null); // needed to keep track of input's state, init'd with null

    const handleCleanup = () => {
        clearBoatsState();
        clearFileState();
        clearPlayerState();
        clearUrlState();
        history.push('/')
    }

    useEffect(() => {
        handleCleanup();
    }, []);

    const handleChange = (e) => {
        const [file] = e.target.files;
        setFileName(file ? file.name : "default.csv");
        setLoading(!isLoading);
        handleProcessData(file, handleSetState);
    }

    const handleSetState = (data) => {
        if (!data) {
            setLoading(false);
            setShowError(true);
            return;
        }
        setupBoat(data.obj);
        setHeaders(data.headers);
        setPlayer(data.player)
        history.push('/setup')
    }

    const handleClick = async (e) => {
        const { id } = e.currentTarget;
        switch (id) {
            case "irl":
                history.push('/setup')
                return;
            case "file-upload":
                inputFile.current.click();
                return;
            default:
                return;
        }
    }

    return (
        <Fade timeout={1000} in={true} mountOnEnter unmountOnExit>
        <Container maxWidth="xl" className={classes.container}>
            <Grid container spacing={2} className={classes.container}>
                {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
                ) : (
                <>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Button
                            id="irl"
                            onClick={handleClick}
                            fullWidth
                        >
                            Просмотр данных в режиме реального времени
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={6} >
                    <Paper className={classes.paper}>
                    <input
                        id="input-file"
                        type="file"
                        onChange={handleChange}
                        accept=".csv,.txt"
                        style={{display: "none"}}
                        ref={inputFile}
                    />
                    <Button
                        id="file-upload"
                        onClick={handleClick}
                        fullWidth
                    >
                        Просмотр данных из файла
                    </Button>
                    </Paper>
                </Grid>
                </>
                )}
            </Grid>
            <ShowError showError={showError} setShowError={setShowError} />
        </Container>
        </Fade>
    );
}

export default WelcomePage;