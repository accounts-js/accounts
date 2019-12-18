import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useAuth } from './AuthContext';
import { accountsClient } from '../accounts';

export const AppBar = () => {
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
        <Typography variant="h6">Accounts-js demo</Typography>
        {/* TODO style */}
        {user && (
          <Button variant="contained" onClick={onLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};
