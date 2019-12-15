import React, { useState } from 'react';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
  Container,
  makeStyles,
  Card,
  CardContent,
  Divider,
  Link,
} from '@material-ui/core';

import { accountsPassword } from './accounts';
import FormError from './components/FormError';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const SignUpLink = React.forwardRef<RouterLink, any>((props, ref) => (
  <RouterLink to="/signup" {...props} ref={ref} />
));
const ResetPasswordLink = React.forwardRef<RouterLink, any>((props, ref) => (
  <RouterLink to="/reset-password" {...props} ref={ref} />
));

const Login = ({ history }: RouteComponentProps<{}>) => {
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
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Card>
        <CardContent className={classes.cardContent}>
          <form onSubmit={onSubmit} className={classes.formContainer}>
            <Typography variant="h5" gutterBottom>
              Sign in
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
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
            {error && <FormError error={error!} />}
            <Divider className={classes.divider} />
            <Link component={SignUpLink}>Sign Up</Link>
            <Link component={ResetPasswordLink}>Reset Password</Link>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
