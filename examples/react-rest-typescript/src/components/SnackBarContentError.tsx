import { SnackbarContent } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}));

interface SnackBarContentErrorProps {
  message?: string;
}

export const SnackBarContentError = ({ message }: SnackBarContentErrorProps) => {
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
