import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { accountsPassword } from './utils/accounts';
import FormError from './components/FormError';

const useStyles = makeStyles({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignUpLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to="/signup" {...props} ref={ref} />
));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResetPasswordLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to="/reset-password" {...props} ref={ref} />
));

const Login = ({ history }: RouteComponentProps) => {
  const classes = useStyles();
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
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <FormControl margin="normal">
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="password">2fa code if enabled</InputLabel>
        <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
      </FormControl>
      <Button variant="contained" color="primary" type="submit">
        Login
      </Button>
      {error && <FormError error={error!} />}
      <Button component={SignUpLink}>Sign Up</Button>
      <Button component={ResetPasswordLink}>Reset Password</Button>
    </form>
  );
};

export default Login;
