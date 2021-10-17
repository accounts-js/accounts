import React, { useState, useEffect } from 'react';
import { Button, Typography, FormControl, InputLabel, Input } from '@material-ui/core';
import QRCode from 'qrcode.react';

import { accountsGraphQL } from './utils/accounts';

const TwoFactor = () => {
  const [secret, setSecret] = useState<any>();
  const [oneTimeCode, setOneTimeCode] = useState('');

  const fetchTwoFactorSecret = async () => {
    const data = await accountsGraphQL.getTwoFactorSecret();
    if (data) {
      const { __typename, ...secretFields } = data;
      setSecret(secretFields);
    }
  };

  useEffect(() => {
    fetchTwoFactorSecret();
  }, []);

  const onSetTwoFactor = async () => {
    try {
      await accountsGraphQL.twoFactorSet(secret, oneTimeCode);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (!secret) {
    return null;
  }
  return (
    <div>
      <Typography gutterBottom>Two-factor authentication</Typography>
      <Typography gutterBottom>Backup code:</Typography>
      <Typography gutterBottom>{secret.base32}</Typography>
      <Typography gutterBottom>Use Google Authenticator for example</Typography>
      <QRCode value={secret.otpauth_url} />
      <Typography gutterBottom>Confirm with one-time code:</Typography>
      <FormControl margin="normal">
        <InputLabel htmlFor="one-time-code">One time code</InputLabel>
        <Input
          id="one-time-code"
          value={oneTimeCode}
          onChange={(e) => setOneTimeCode(e.target.value)}
        />
      </FormControl>
      <Button onClick={onSetTwoFactor}>Submit</Button>
    </div>
  );
};

export default TwoFactor;
