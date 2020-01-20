import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CardActions,
  TextField,
} from '@material-ui/core';
import QRCode from 'qrcode.react';
import { Authenticator } from '@accounts/types';
import { accountsClient, accountsRest } from './accounts';

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
  cardActions: {
    padding: theme.spacing(3),
  },
  qrCode: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
}));

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

  return (
    <Card className={classes.card}>
      <CardHeader subheader="Two-factor authentication" className={classes.cardHeader} />
      <Divider />
      <CardContent className={classes.cardContent}>
        {authenticators.map(authenticator => {
          if (authenticator.type === 'otp') {
            return (
              <div key={authenticator.id}>
                {/* <p>
            <FiberManualRecordIcon color="primary" /> Authenticator App
          </p> */}
                <p>Created at: {(authenticator as any).createdAt}</p>
                <p>Activated at: {authenticator.activatedAt}</p>
              </div>
            );
          }
          return null;
        })}
      </CardContent>
    </Card>
  );
};
