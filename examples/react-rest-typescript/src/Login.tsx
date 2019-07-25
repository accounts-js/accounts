import React, { useState } from 'react';
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

const SignUpLink = (props: any) => <Link to="/signup" {...props} />;
const ResetPasswordLink = (props: any) => <Link to="/reset-password" {...props} />;

const Login = ({ classes, history }: WithStyles<'formContainer'> & RouteComponentProps<{}>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await accountsPassword.login({
        user: {
          email,
        },
        password,
        code,
      });
      history.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
      <Typography variant="display1" gutterBottom>
        Login
      </Typography>
      <FormControl margin="normal">
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="password">2fa code if enabled</InputLabel>
        <Input id="code" value={code} onChange={e => setCode(e.target.value)} />
      </FormControl>
      <Button variant="raised" color="primary" type="submit">
        Login
      </Button>
      {error && <FormError error={error!} />}
      <Button component={SignUpLink}>Sign Up</Button>
      <Button component={ResetPasswordLink}>Reset Password</Button>
    </form>
  );
};

export default withStyles(styles)(Login);
