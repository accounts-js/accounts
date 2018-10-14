import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { CssBaseline, withStyles, WithStyles, Grid, Paper } from '@material-ui/core';

import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';
import TwoFactor from './TwoFactor';

const styles = () => ({
  root: {
    margin: 'auto',
    maxWidth: 500,
    marginTop: 50,
  },
  container: {
    padding: 16,
  },
});

const Router = ({ classes }: WithStyles<'root' | 'container'>) => {
  return (
    <BrowserRouter>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Paper className={classes.container}>
            <CssBaseline />
            <Route exact path="/" component={Home} />
            <Route path="/two-factor" component={TwoFactor} />

            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />
            <Route path="/verify-email/:token" component={VerifyEmail} />
          </Paper>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
};

export default withStyles(styles)<{}>(Router);
