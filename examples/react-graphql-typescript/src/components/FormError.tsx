import React from 'react';
import { Typography, withStyles, WithStyles } from '@material-ui/core';

const styles = () => ({
  formError: {
    color: 'red',
  },
});

interface IProps {
  error: string;
}

const FormError = ({ classes, error }: WithStyles<'formError'> & IProps) => {
  return <Typography className={classes.formError}>{error}</Typography>;
};

export default withStyles(styles)(FormError);
