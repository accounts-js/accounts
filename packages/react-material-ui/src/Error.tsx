import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

export const Error = withStyles(theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
  },
}))(({ error, classes }: any) => (
  <div className={classes.root}>
    <Typography variant="subtitle2" color="error">
      {error}
    </Typography>
  </div>
));
