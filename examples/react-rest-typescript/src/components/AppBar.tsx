import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuth } from './AuthContext';
import { accountsClient } from '../accounts';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
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
}

export const AppBar = ({ onDrawerToggle }: AppBarProps) => {
  const classes = useStyles();
  const { user, fetchUser } = useAuth();
  const history = useHistory();

  const onLogout = async () => {
    await accountsClient.logout();
    await fetchUser();
    history.push('/login');
  };

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
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" className={classes.title}>
          Accounts-js demo
        </Typography>
        {user && (
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};
