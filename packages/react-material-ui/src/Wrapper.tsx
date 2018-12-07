import React from 'react';
import { Paper, withStyles } from '@material-ui/core';

export const Wrapper = withStyles(theme => ({
  root: {
    maxWidth: theme.spacing.unit * 56,
    margin: '0 auto',
  },
  paper: {
    display: 'flex',
    padding: theme.spacing.unit * 5,
    margin: theme.spacing.unit * 2,
    flexDirection: 'column',
  },
}))(({ classes, children }: any) => (
  <div className={classes.root}>
    <Paper className={classes.paper}>{children}</Paper>
  </div>
));
