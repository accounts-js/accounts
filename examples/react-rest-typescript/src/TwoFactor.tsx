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

const useStyles = makeStyles(theme => ({
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
}));

export const TwoFactor = () => {
  const classes = useStyles();
  const history = useHistory();
  const [authenticators, setAuthenticators] = useState<Authenticator[]>([]);

  useEffect(() => {
    const fetchAuthenticators = async () => {
      const data = await accountsClient.authenticators();
      setAuthenticators(data);
      console.log(data);
    };

    fetchAuthenticators();
  }, []);

  return (
    <Card className={classes.card}>
      <CardHeader subheader="Two-factor authentication" className={classes.cardHeader} />
      <Divider />
      <CardContent className={classes.cardContent}>
        {authenticators.map(authenticator => {
          if (authenticator.type === 'otp') {
            return (
              <div key={authenticator.id} className={classes.authenticatorItem}>
                <div key={authenticator.id} className={classes.authenticatorItemTitle}>
                  <FiberManualRecordIcon
                    className={classes.authenticatorItemDot}
                    color={authenticator.active ? 'secondary' : 'error'}
                  />
                  <Typography>Authenticator App</Typography>
                </div>
                {authenticator.active ? (
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
            );
          }
          return null;
        })}
      </CardContent>
    </Card>
  );
};
