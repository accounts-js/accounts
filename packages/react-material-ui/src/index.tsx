import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { AccountsConsumer, AccountsProvider as BaseAccountsProvider } from '@accounts/react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { compose, withProps, withStateHandlers } from 'recompose';

const LoginFormUserField = ({ handleChange }) => (
  <AccountsConsumer>
    {({ labels }: any) => (
      <TextField
        className="accounts-user-field"
        onChange={handleChange}
        margin="normal"
        label={labels.login.username}
      />
    )}
  </AccountsConsumer>
);

const LoginFormPasswordField = ({ handleChange }) => (
  <AccountsConsumer>
    {({ labels }: any) => (
      <TextField
        className="accounts-password-field"
        onChange={handleChange}
        margin="normal"
        label={labels.login.password}
      />
    )}
  </AccountsConsumer>
);

const LoginForm = withStyles(theme => ({
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
}))(({ classes }) => (
  <AccountsConsumer>
    {({ labels, components, handleChangeView }) => (
      <div className={classes.root}>
        <components.login.UserField />
        <components.login.PasswordField />
        <div className={classes.actions}>
          <components.login.SignupButton />
          <components.login.LoginButton />
        </div>
      </div>
    )}
  </AccountsConsumer>
));

const LoginFormLoginButton = () => (
  <AccountsConsumer>
    {({ labels }) => (
      <Button variant="contained" color="primary">
        {labels.login.login}
      </Button>
    )}
  </AccountsConsumer>
);

const LoginFormSignupButton = () => (
  <AccountsConsumer>
    {({ labels, handleChangeView }) => (
      <Button variant="outlined" color="secondary" onClick={() => handleChangeView('signup')}>
        {labels.login.signup}
      </Button>
    )}
  </AccountsConsumer>
);

const SignupFormUserField = ({ handleChange }) => (
  <AccountsConsumer>
    {({ labels }: any) => (
      <TextField
        className="accounts-user-field"
        onChange={handleChange}
        margin="normal"
        label={labels.signup.username}
      />
    )}
  </AccountsConsumer>
);

const SignupFormPasswordField = ({ handleChange }) => (
  <AccountsConsumer>
    {({ labels }: any) => (
      <TextField
        className="accounts-password-field"
        onChange={handleChange}
        margin="normal"
        label={labels.signup.password}
      />
    )}
  </AccountsConsumer>
);

const SignupForm = withStyles(theme => ({
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
    {({ labels, handleChangeView, components }) => (
      <div className={classes.root}>
        <components.signup.UserField />
        <components.signup.PasswordField />
        <div className={classes.actions}>
          <components.signup.LoginButton />
          <components.signup.SignupButton />
        </div>
      </div>
    )}
  </AccountsConsumer>
));

const SignupFormLoginButton = () => (
  <AccountsConsumer>
    {({ labels, handleChangeView }) => (
      <Button variant="outlined" color="secondary" onClick={() => handleChangeView('login')}>
        {labels.signup.loginInstead}
      </Button>
    )}
  </AccountsConsumer>
);

const SignupFormSignupButton = () => (
  <AccountsConsumer>
    {({ labels }) => (
      <Button variant="contained" color="primary">
        {labels.signup.signup}
      </Button>
    )}
  </AccountsConsumer>
);

const Wrapper = withStyles(theme => ({
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

export default {
  Wrapper,
  login: {
    LoginForm,
    UserField: LoginFormUserField,
    PasswordField: LoginFormPasswordField,
    SignupButton: LoginFormSignupButton,
    LoginButton: LoginFormLoginButton,
  },
  signup: {
    SignupForm,
    UserField: SignupFormUserField,
    PasswordField: SignupFormPasswordField,
    SignupButton: SignupFormSignupButton,
    LoginButton: SignupFormLoginButton,
  },
};
