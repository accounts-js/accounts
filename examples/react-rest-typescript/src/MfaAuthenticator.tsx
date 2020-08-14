import React from 'react';
import { makeStyles, Typography, Divider, Card, CardHeader, CardContent } from '@material-ui/core';
import { AuthenticatedContainer } from './components/AuthenticatedContainer';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(2),
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
  authenticatorDescription: {
    marginTop: theme.spacing(1),
  },
}));

export const MfaAuthenticator = () => {
  const classes = useStyles();

  return (
    <AuthenticatedContainer>
      <Typography variant="h5">Authenticator Details</Typography>
      <Divider className={classes.divider} />
      <Card className={classes.card}>
        {/* TODO title and content based on the type */}
        <CardHeader subheader="Authenticator app" className={classes.cardHeader} />
        <Divider />
        <CardContent className={classes.cardContent}>
          TODO
          <Typography className={classes.authenticatorDescription}>
            An authenticator application that supports TOTP (like Google Authenticator or 1Password)
            can be used to conveniently secure your account. A new token is generated every 30
            seconds.
          </Typography>
        </CardContent>
        <Divider />
      </Card>
    </AuthenticatedContainer>
  );
};
