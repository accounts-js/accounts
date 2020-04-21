import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Authenticator } from '@accounts/types';
import { accountsClient } from './accounts';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
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
  authenticatorItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  authenticatorItemTitle: {
    display: 'flex',
  },
  authenticatorItemDot: {
    marginRight: theme.spacing(2),
  },
  authenticatorItemDescription: {
    marginTop: theme.spacing(1),
  },
}));

interface AuthenticatorOtpProps {
  authenticator?: Authenticator;
}

const AuthenticatorOtp = ({ authenticator }: AuthenticatorOtpProps) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <React.Fragment>
      <div className={classes.authenticatorItem}>
        <div className={classes.authenticatorItemTitle}>
          <FiberManualRecordIcon
            className={classes.authenticatorItemDot}
            color={authenticator?.active ? 'secondary' : 'error'}
          />
          <Typography>Authenticator App (OTP)</Typography>
        </div>
        {authenticator?.active ? (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => history.push(`/security/mfa/${authenticator.id}`)}
          >
            Configure
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => history.push('/security/mfa/otp')}
          >
            Add
          </Button>
        )}
      </div>
      <Typography className={classes.authenticatorItemDescription}>
        An authenticator application that supports TOTP (like Google Authenticator or 1Password) can
        be used to conveniently secure your account. A new token is generated every 30 seconds.
      </Typography>
    </React.Fragment>
  );
};

export const TwoFactor = () => {
  const classes = useStyles();
  const [authenticators, setAuthenticators] = useState<Authenticator[]>([]);

  useEffect(() => {
    const fetchAuthenticators = async () => {
      const data = await accountsClient.authenticators();
      setAuthenticators(data);
      console.log(data);
    };

    fetchAuthenticators();
  }, []);

  const haveOtpFactor = authenticators.find((authenticator) => authenticator.type === 'otp');

  return (
    <Card className={classes.card}>
      <CardHeader subheader="Two-factor authentication" className={classes.cardHeader} />
      <Divider />
      <CardContent className={classes.cardContent}>
        {!haveOtpFactor && <AuthenticatorOtp />}
        {authenticators.map((authenticator) => {
          if (authenticator.type === 'otp') {
            return <AuthenticatorOtp key={authenticator.id} authenticator={authenticator} />;
          }
          return null;
        })}
      </CardContent>
    </Card>
  );
};
