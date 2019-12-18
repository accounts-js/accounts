import React from 'react';
import { makeStyles, Container, Typography } from '@material-ui/core';
import { TwoFactor } from './TwoFactor';
import { ChangePassword } from './ChangePassword';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export const Security = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h5">Security</Typography>
      <ChangePassword />
      <TwoFactor />
    </Container>
  );
};
