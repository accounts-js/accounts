import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { AccountsConsumer } from '@accounts/react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { compose, withProps, withStateHandlers } from 'recompose';

export const UserField = ({ handleChange }) => (
  <AccountsConsumer>
    {({ accountsLabels }: any) => (
      <TextField
        className="accounts-user-field"
        onChange={handleChange}
        margin="normal"
        label={accountsLabels.username}
      />
    )}
  </AccountsConsumer>
);

export const PasswordField = ({ handleChange }) => (
  <AccountsConsumer>
    {({ accountsLabels }: any) => (
      <TextField
        className="accounts-password-field"
        onChange={handleChange}
        margin="normal"
        label={accountsLabels.password}
      />
    )}
  </AccountsConsumer>
);

export const LoginForm = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2,
  },
  button: {},
}))(({ classes }) => (
  <AccountsConsumer>
    {({ accountsLabels, handleChangeView }) => (
      <div className={classes.root}>
        <UserField />
        <PasswordField />
        <div className={classes.actions}>
          <Button
            color="secondary"
            variant="outlined"
            className={classes.button}
            onClick={() => handleChangeView('signup')}
          >
            {accountsLabels.signup}
          </Button>
          <Button variant="contained" color="primary" className={classes.button}>
            {accountsLabels.login}
          </Button>
        </div>
      </div>
    )}
  </AccountsConsumer>
));

export const SignupForm = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2,
  },
  button: {},
}))(({ classes }) => (
  <AccountsConsumer>
    {({ accountsLabels, handleChangeView }) => (
      <div className={classes.root}>
        <UserField />
        <PasswordField />
        <div className={classes.actions}>
          <Button
            color="secondary"
            variant="outlined"
            className={classes.button}
            onClick={() => handleChangeView('login')}
          >
            {accountsLabels.loginInstead}
          </Button>
          <Button variant="contained" color="primary" className={classes.button}>
            {accountsLabels.signup}
          </Button>
        </div>
      </div>
    )}
  </AccountsConsumer>
));

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
}))(({ classes, children }) => (
  <div className={classes.root}>
    <Paper className={classes.paper}>{children}</Paper>
  </div>
));

export const Accounts = () => (
  <AccountsConsumer>
    {({ view }) => {
      return (
        <Wrapper>
          {view === 'login' && <LoginForm />}
          {view === 'signup' && <SignupForm />}
        </Wrapper>
      );
    }}
  </AccountsConsumer>
);
