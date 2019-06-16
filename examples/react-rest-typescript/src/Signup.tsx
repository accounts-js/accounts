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
} from '@material-ui/core';

import { accountsPassword } from './accounts';
import FormError from './components/FormError';

const styles = () => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
});

const LogInLink = (props: any) => <Link to="/login" {...props} />;

interface State {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  error: string | null;
}

class Signup extends React.Component<WithStyles<'formContainer'> & RouteComponentProps<{}>, State> {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    error: null,
  };

  onChangeFirstName = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ firstName: target.value });
  };

  onChangeLastName = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lastName: target.value });
  };

  onChangeEmail = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: target.value });
  };

  onChangePassword = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: target.value });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ error: null });
    try {
      await accountsPassword.createUser({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      });
      this.props.history.push('/login');
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    const { classes } = this.props;
    const { firstName, lastName, email, password, error } = this.state;
    return (
      <form onSubmit={this.onSubmit} className={classes.formContainer}>
        <Typography variant="display1" gutterBottom>
          Sign up
        </Typography>
        <FormControl margin="normal">
          <InputLabel htmlFor="firstName">First name</InputLabel>
          <Input id="firstName" value={firstName} onChange={this.onChangeFirstName} />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="lastName">Last name</InputLabel>
          <Input id="lastName" value={lastName} onChange={this.onChangeLastName} />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" value={email} onChange={this.onChangeEmail} />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" value={password} onChange={this.onChangePassword} />
        </FormControl>
        <Button variant="raised" color="primary" type="submit">
          Sign Up
        </Button>
        {error && <FormError error={error} />}
        <Button component={LogInLink}>Log In</Button>
      </form>
    );
  }
}

export default withStyles(styles)(Signup);
