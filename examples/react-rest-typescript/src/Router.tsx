import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AuthProvider, useAuth } from './components/AuthContext';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';
import { Security } from './Security';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ children, ...rest }: any) => {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CssBaseline />

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Accounts-js demo</Typography>
          </Toolbar>
        </AppBar>

        {/* Authenticated routes */}
        <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>
        <PrivateRoute path="/security">
          <Security />
        </PrivateRoute>

        {/* Unauthenticated routes */}
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/verify-email/:token" component={VerifyEmail} />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
