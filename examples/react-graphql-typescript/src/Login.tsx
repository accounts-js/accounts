import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import FormError from './components/FormError';
import { accountsPassword } from './utils/accounts';

const styles = () => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
});

const SignUpLink = (props: any) => <Link to="/signup" {...props} />;
const ResetPasswordLink = (props: any) => <Link to="/reset-password" {...props} />;

interface IState {
  email: string;
  password: string;
  code: string;
  error: string | null;
}

class Login extends React.Component<WithStyles<'formContainer'> & RouteComponentProps<{}>, IState> {
  public state = {
    code: '',
    email: '',
    error: null,
    password: '',
  };

  public onChangeEmail = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: target.value });
  };

  public onChangePassword = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: target.value });
  };

  public onChangeCode = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ code: target.value });
  };

  public onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ error: null });
    try {
      await accountsPassword.login({
        code: this.state.code,
        password: this.state.password,
        user: {
          email: this.state.email,
        },
      });
      this.props.history.push('/');
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  public render() {
    const { classes } = this.props;
    const { email, password, code, error } = this.state;
    return (
      <form onSubmit={this.onSubmit} className={classes.formContainer}>
        <Typography variant="display1" gutterBottom={true}>
          Login
        </Typography>
        <FormControl margin="normal">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" value={email} autoComplete="email" onChange={this.onChangeEmail} />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={this.onChangePassword}
          />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="password">2fa code if enabled</InputLabel>
          <Input id="code" value={code} onChange={this.onChangeCode} />
        </FormControl>
        <Button variant="raised" color="primary" type="submit">
          Login
        </Button>
        {error && <FormError error={error} />}
        <Button component={SignUpLink}>Sign Up</Button>
        <Button component={ResetPasswordLink}>Reset Password</Button>
      </form>
    );
  }
}

export default withStyles(styles)(Login);
