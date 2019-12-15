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

import { accountsRest } from './accounts';

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
  const [secret, setSecret] = useState();
  const [oneTimeCode, setOneTimeCode] = useState('');

  const fetchTwoFactorSecret = async () => {
    const data = await accountsRest.getTwoFactorSecret();
    setSecret(data.secret);
  };

  useEffect(() => {
    fetchTwoFactorSecret();
  }, []);

  const onSetTwoFactor = async () => {
    try {
      await accountsRest.twoFactorSet(secret, oneTimeCode);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!secret) {
    return null;
  }
  return (
    <Card className={classes.card}>
      <CardHeader subheader="Two-factor authentication" className={classes.cardHeader} />
      <Divider />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom>Authenticator secret: {secret.base32}</Typography>
        <QRCode className={classes.qrCode} value={secret.otpauth_url} />
        <TextField
          label="Authenticator code"
          variant="outlined"
          fullWidth={true}
          className={classes.textField}
          id="code"
          value={oneTimeCode}
          onChange={e => setOneTimeCode(e.target.value)}
          helperText="Scan the code with your Two-Factor app and enter the one time password to confirm"
        />
      </CardContent>
      <Divider />
      <CardActions className={classes.cardActions}>
        <Button variant="contained" onClick={onSetTwoFactor}>
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};
