import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useAuth } from './AuthContext';
import { accountsClient } from '../accounts';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

export const AppBar = () => {
  const classes = useStyles();
  const { user, fetchUser } = useAuth();
  const history = useHistory();

  const onLogout = async () => {
    await accountsClient.logout();
    await fetchUser();
    history.push('/login');
  };

  return (
    <MuiAppBar position="static">
      <Toolbar>
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
