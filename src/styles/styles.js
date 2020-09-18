import { 
  createMuiTheme,
} from '@material-ui/core';
import { 
  makeStyles, 
} from '@material-ui/core/styles';

export const theme = createMuiTheme();

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBarText: {
    cursor: "pointer",
    textTransform: "none",
    color: "#fff",
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden',
  },
  container: {
    height: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  mapContainer: {
    height: '95%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  map: {
    height: '100%',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: "100%",
  },
  fabWrapper: {
    position: 'absolute',
    display: 'flex',
    zIndex: '1000',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fab: {
    marginRight: `${theme.spacing(1)}px !important`,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: "80vh",
  },
  colorDiv: {
    height: '3vh',
    width: '3vh',
    borderRadius: '50%'
  },
  tableRow: {
    cursor: 'pointer',
  },
  dialog: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  palette: {
    minWidth: '64px !important',
    minHeight: '64px !important',
    maxHeight: '100% !important',
    maxWidth: '100% !important',
    borderRadius: '50% !important',
    margin: `${theme.spacing(4)}px 0 !important`,
  },
  player: {
    position: 'fixed',
    zIndex: '999',
    bottom: '60px',
    maxHeight: '60px',
    color: '#ffffff',
    marginLeft: '40px',
    marginRight: '40px',
    backgroundColor: '#000000',
    textAlign: 'center'
  },
  northDiv: {
    position: 'fixed',
    zIndex: '999',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  northText: {
    display: 'flex',
    flexDirection: 'column',
    color: 'dodgerblue',
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '5px',
    margin: '10px',
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  },
  northIcon: {
    display: 'block',
    marginBottom: '-15px',
    marginTop: '-10px'
  },
  windDiv: {
    position: 'fixed',
    zIndex: '999',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: '10px',
    
  },
  windText: {
    textAlign: 'center',
    display: 'inline-grid',
    margin: '10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    color: 'black',
    padding: '5px',
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  },
  arrowsDiv: {
    position: 'relative'
  },
  arrow: {
    transition: "all 350ms ease-in-out !important",
    transformOrigin: 'center',
    height: '32px !important',
    width: '32px !important',
    margin: '0 10px',
  },
  redArrow: {
    position: 'absolute',
    bottom: '0%',
    right: '0%',
    height: '32px !important',
    width: '32px !important',
    margin: '10px 10px',
    color: 'rgba(255, 0, 0, 0.5)'
  },
  polyline: {
    transition: 'all 330ms ease-in-out',
  }
}));