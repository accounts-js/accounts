import React, { useState, useEffect } from 'react';
import { Button, Typography, FormControl, InputLabel, Input } from '@material-ui/core';
import QRCode from 'qrcode.react';

import { accountsRest, accountsClient } from './accounts';

interface OTP {
  otpauthUri: string;
  secret: string;
}

const TwoFactor = () => {
  const [secret, setSecret] = useState<OTP | undefined>();
  const [oneTimeCode, setOneTimeCode] = useState('');

  const fetchTwoFactorSecret = async () => {
    // TODO try catch and show error if needed
    const data = await accountsClient.mfaAssociate('otp');
    setSecret(data);
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
    <div>
      <Typography gutterBottom>Two-factor authentication</Typography>
      <Typography gutterBottom>Backup code:</Typography>
      <Typography gutterBottom>{secret.secret}</Typography>
      <Typography gutterBottom>Use Google Authenticator for example</Typography>
      <QRCode value={secret.otpauthUri} />
      <Typography gutterBottom>Confirm with one-time code:</Typography>
      <FormControl margin="normal">
        <InputLabel htmlFor="one-time-code">One time code</InputLabel>
        <Input
          id="one-time-code"
          value={oneTimeCode}
          onChange={e => setOneTimeCode(e.target.value)}
        />
      </FormControl>
      <Button onClick={onSetTwoFactor}>Submit</Button>
    </div>
  );
};

export default TwoFactor;
