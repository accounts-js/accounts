import React from 'react';
import { Typography } from '@material-ui/core';
import { TwoFactor } from './TwoFactor';
import { ChangePassword } from './ChangePassword';
import { AuthenticatedContainer } from './components/AuthenticatedContainer';

export const Security = () => {
  return (
    <AuthenticatedContainer>
      <Typography variant="h5">Security</Typography>
      <ChangePassword />
      <TwoFactor />
    </AuthenticatedContainer>
  );
};
