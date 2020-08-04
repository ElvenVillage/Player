import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@material-ui/core';
import {
  useStoreActions,
  useStoreState
} from 'easy-peasy';
import {Link} from 'react-router-dom'

export const TopBar = () => {
  const { clearFileState } = useStoreActions(actions => actions.file);
  const { clearBoatsState } = useStoreActions(actions => actions.boats);
  const { clearPlayerState } = useStoreActions(actions => actions.player);
  const { clearUrlState } = useStoreActions(actions => actions.url);
  const { classes } = useStoreState(state => state.classes);

  const handleGoMainMenu = () => {
      clearBoatsState();
      clearFileState();
      clearPlayerState();
      clearUrlState();
  };

  return (
    <React.Fragment>
      <AppBar color="primary" position="relative">
        <Toolbar>
          <Button component={Link} to="/"
              onClick={handleGoMainMenu}
          >
            <Typography
              className={classes.appBarText}
              variant="h6"
              noWrap
            >
              Map Tool
            </Typography>
            </Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
};

export default TopBar;