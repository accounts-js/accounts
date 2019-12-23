import React from 'react';
import { Typography, Divider, makeStyles } from '@material-ui/core';
import { TwoFactor } from './TwoFactor';
import { ChangePassword } from './ChangePassword';
import { AuthenticatedContainer } from './components/AuthenticatedContainer';

const useStyles = makeStyles(theme => ({
  divider: {
    marginTop: theme.spacing(2),
  },
}));

export const Security = () => {
  const classes = useStyles();

  return (
    <AuthenticatedContainer>
      <Typography variant="h5">Security</Typography>
      <Divider className={classes.divider} />
      <ChangePassword />
      <TwoFactor />
    </AuthenticatedContainer>
  );
};
