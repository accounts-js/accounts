import { AccountsConsumer } from '@accounts/react';
import { Button, Fade, TextField, withStyles } from '@material-ui/core';
import React from 'react';

export const UserField = ({ handleChange, error }) => (
  <AccountsConsumer>
    {({ labels }: any) => (
      <TextField
        name="user"
        error={!!error}
        helperText={error}
        className="accounts-user-field"
        onChange={handleChange}
        margin="normal"
        label={labels.user}
      />
    )}
  </AccountsConsumer>
);

export const PasswordField = ({ handleChange, error }) => (
  <AccountsConsumer>
    {({ labels }: any) => (
      <TextField
        name="password"
        type="password"
        error={!!error}
        helperText={error}
        className="accounts-password-field"
        onChange={handleChange}
        margin="normal"
        label={labels.password}
      />
    )}
  </AccountsConsumer>
);

export const Form = withStyles(
  (): any => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
  })
)(({ classes, children }: any) => (
  <AccountsConsumer>
    {() => (
      <div>
        <Fade in>
          <div className={classes.root}>{children}</div>
        </Fade>
      </div>
    )}
  </AccountsConsumer>
));

export const Fields = withStyles(
  (): any => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
  })
)(({ children, classes }: any) => (
  <AccountsConsumer>{() => <div className={classes.root}>{children}</div>}</AccountsConsumer>
));

export const Actions = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
}))(({ children, classes }: any) => (
  <AccountsConsumer>{() => <div className={classes.root}>{children}</div>}</AccountsConsumer>
));

export const SignInButton = ({ onClick }) => (
  <AccountsConsumer>
    {({ labels }) => (
      <Button variant="contained" color="primary" onClick={onClick}>
        {labels.signIn}
      </Button>
    )}
  </AccountsConsumer>
);

export const SignUpButton = ({ onClick }) => (
  <AccountsConsumer>
    {({ labels }) => (
      <Button variant="text" onClick={onClick}>
        {labels.signUp}
      </Button>
    )}
  </AccountsConsumer>
);
