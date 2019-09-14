import React from 'react';
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Snackbar,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import Link from 'next/link';
import FormError from './FormError';
import { accountsPassword } from '../utils/accounts';
import { useRouter } from 'next/router';

const styles = () => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
});

interface State {
  email: string;
  newPassword: string;
  error: string | null;
  snackbarMessage: string | null;
}

class Login extends React.Component<WithStyles<'formContainer'>, State> {
  public state = {
    email: '',
    error: null,
    newPassword: '',
    snackbarMessage: null,
  };

  public onChangeEmail = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: target.value });
  };

  public onChangeNewPassword = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPassword: target.value });
  };

  public onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ error: null, snackbarMessage: null });
    const router = useRouter();
    console.log(router.query);
    const token = router.query.token as string;
    try {
      // If no tokens send email to user
      if (!token) {
        await accountsPassword.requestPasswordReset(this.state.email);
        this.setState({ snackbarMessage: 'Email sent' });
      } else {
        // If token try to change user password
        await accountsPassword.resetPassword(token, this.state.newPassword);
        this.setState({
          snackbarMessage: 'Your password has been reset successfully',
        });
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      this.setState({ error: err.message, snackbarMessage: null });
    }
  };

  public onSanckbarClose = () => {
    this.setState({ snackbarMessage: null });
  };

  public render() {
    // const { classes, match } = this.props;
    // const { locale } = useTranslation();

    const { email, newPassword, error, snackbarMessage } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <Typography variant="h3" gutterBottom={true}>
          Reset Password
        </Typography>
        {
          <FormControl margin="normal">
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" value={email} onChange={this.onChangeEmail} />
          </FormControl>
        }
        {
          <FormControl margin="normal">
            <InputLabel htmlFor="new-password">New Password</InputLabel>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={this.onChangeNewPassword}
            />
          </FormControl>
        }
        <Button variant="outlined" color="primary" type="submit">
          Reset Password
        </Button>
        {/*  eslint-disable-next-line */}
        {error && <FormError error={error!} />}
        <Button>
          <Link href="/login" as={`/login`}>
            <a>Log In</a>
          </Link>
        </Button>
        <Snackbar
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top',
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
