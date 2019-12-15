import React from 'react';
import { SnackbarContent, makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles({
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    backgroundColor: green[600],
  },
});

interface SnackBarContentSuccessProps {
  message?: string;
}

export const SnackBarContentSuccess = ({ message }: SnackBarContentSuccessProps) => {
  const classes = useStyles();

  return (
    <SnackbarContent
      className={classes.error}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          {message}
        </span>
      }
    />
  );
};
