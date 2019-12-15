import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Button,
  Typography,
  Container,
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';
import { accountsClient, accountsRest } from './accounts';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  card: {
    marginTop: theme.spacing(3),
  },
  cardHeader: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  cardContent: {
    padding: theme.spacing(3),
  },
}));

const Home = ({ history }: RouteComponentProps<{}>) => {
  const classes = useStyles();
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
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h5">Account Details</Typography>
      <Card className={classes.card}>
        <CardHeader subheader="Emails" className={classes.cardHeader} />
        <Divider />
        <CardContent className={classes.cardContent}>
          {user.emails.map((email: any, index: number) => (
            <React.Fragment key={index}>
              <Typography gutterBottom>
                {email.address}: {email.verified ? 'verified' : 'unverified'}
              </Typography>
              {!email.verified && (
                <Button onClick={onResendEmail}>Resend verification email</Button>
              )}
            </React.Fragment>
          ))}

          <Button variant="contained" color="primary" onClick={onLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
