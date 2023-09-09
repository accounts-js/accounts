import React from 'react';
import { SnackbarContent } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { green } from '@mui/material/colors';

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
