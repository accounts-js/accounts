import { AppBar as MuiAppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from './AuthContext';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      display: 'none',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
}));

interface AppBarProps {
  onDrawerToggle?: () => void;
  onLogout?: () => void;
}

export const AppBar = ({ onDrawerToggle, onLogout }: AppBarProps) => {
  const classes = useStyles();
  const { user } = useAuth();

  return (
    <MuiAppBar color="default" position="fixed" className={classes.appBar}>
      <Toolbar>
        {user && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            className={classes.menuButton}
            size="large"
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" className={classes.title} />
        {user && (
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};
