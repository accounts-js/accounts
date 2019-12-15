import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import {
  Button,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Grid,
} from '@material-ui/core';

import { accountsClient, accountsRest } from './accounts';

const Home = ({ history }: RouteComponentProps<{}>) => {
  const [user, setUser] = useState();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    // refresh the session to get a new accessToken if expired
    const tokens = await accountsClient.refreshSession();
    if (!tokens) {
      history.push('/login');
      return;
    }
    const res = await fetch('http://localhost:4000/user', {
      headers: {
        Authorization: tokens ? 'Bearer ' + tokens.accessToken : '',
      },
    });
    const data = await res.json();
    setUser(data.user);
  };

  const onResendEmail = async () => {
    await accountsRest.sendVerificationEmail(user.emails[0].address);
  };

  const onLogout = async () => {
    await accountsClient.logout();
    history.push('/login');
  };

  if (!user) {
    return null;
  }
  return (
    <div>
      <Typography gutterBottom>You are logged in</Typography>
      <Typography gutterBottom>Email: {user.emails[0].address}</Typography>
      <Typography gutterBottom>
        You email is {user.emails[0].verified ? 'verified' : 'unverified'}
      </Typography>
      {!user.emails[0].verified && (
        <Button onClick={onResendEmail}>Resend verification email</Button>
      )}

      <Link to="two-factor">Set up 2fa</Link>

      <Button variant="contained" color="primary" onClick={onLogout}>
        Logout
      </Button>

      <Card>
        <CardHeader subheader="Change password" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Old password" variant="outlined" id="old-password" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="New password" variant="outlined" id="new-password" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm new password"
                variant="outlined"
                id="confirm-new-password"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button variant="contained">Update password</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Home;
