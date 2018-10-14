import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import {
  withStyles,
  WithStyles,
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
  Snackbar,
} from '@material-ui/core';

import { accountsRest } from './accounts';
import FormError from './components/FormError';

const styles = () => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
});

const LogInLink = (props: any) => <Link to="/login" {...props} />;

interface RouteMatchProps {
  token: string;
}

interface State {
  email: string;
  newPassword: string;
  error: string | null;
  snackbarMessage: string | null;
}

class Login extends React.Component<
  WithStyles<'formContainer'> & RouteComponentProps<RouteMatchProps>,
  State
> {
  state = {
    email: '',
    newPassword: '',
    error: null,
    snackbarMessage: null,
  };

  onChangeEmail = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: target.value });
  };

  onChangeNewPassword = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPassword: target.value });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ error: null, snackbarMessage: null });
    const token = this.props.match.params.token;
    try {
      // If no tokens send email to user
      if (!token) {
        await accountsRest.sendResetPasswordEmail(this.state.email);
        this.setState({ snackbarMessage: 'Email sent' });
      } else {
        // If token try to change user password
        await accountsRest.resetPassword(token, this.state.newPassword);
        this.setState({
          snackbarMessage: 'Your password has been reset successfully',
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({ error: err.message, snackbarMessage: null });
    }
  };

  onSanckbarClose = () => {
    this.setState({ snackbarMessage: null });
  };

  render() {
    const { classes, match } = this.props;
    const { email, newPassword, error, snackbarMessage } = this.state;
    return (
      <form onSubmit={this.onSubmit} className={classes.formContainer}>
        <Typography variant="display1" gutterBottom>
          Reset Password
        </Typography>
        {!match.params.token && (
          <FormControl margin="normal">
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" value={email} onChange={this.onChangeEmail} />
          </FormControl>
        )}
        {match.params.token && (
          <FormControl margin="normal">
            <InputLabel htmlFor="new-password">New Password</InputLabel>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={this.onChangeNewPassword}
            />
          </FormControl>
        )}
        <Button variant="raised" color="primary" type="submit">
          Reset Password
        </Button>
        {error && <FormError error={error} />}
        <Button component={LogInLink}>Log In</Button>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={!!snackbarMessage}
          autoHideDuration={4000}
          onClose={this.onSanckbarClose}
          message={<span>{snackbarMessage}</span>}
        />
      </form>
    );
  }
}

export default withStyles(styles)(Login);
