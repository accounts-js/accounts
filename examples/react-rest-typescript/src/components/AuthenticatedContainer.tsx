import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router';
import { Container } from './Container';
import { AppBar } from './AppBar';
import { accountsClient } from '../accounts';
import { useAuth } from './AuthContext';
import { Drawer } from './Drawer';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
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
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
}));

interface AuthenticatedContainerProps {
  children: React.ReactNode;
}

export const AuthenticatedContainer = ({ children }: AuthenticatedContainerProps) => {
  const classes = useStyles();
  const history = useHistory();
  const { fetchUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onLogout = async () => {
    await accountsClient.logout();
    await fetchUser();
    history.push('/login');
  };

  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        <AppBar onDrawerToggle={onDrawerToggle} onLogout={onLogout} />
      </nav>

      <Drawer open={mobileOpen} onDrawerToggle={onDrawerToggle} onLogout={onLogout} />

      <Container>{children}</Container>
    </div>
  );
};
