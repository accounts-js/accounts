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
  CardContent,
  Card,
  Divider,
  Link,
  Grid,
} from '@material-ui/core';

import { accountsPassword } from './accounts';
import FormError from './components/FormError';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const LogInLink = React.forwardRef<RouterLink, any>((props, ref) => (
  <RouterLink to="/login" {...props} ref={ref} />
));

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup = ({ history }: RouteComponentProps<{}>) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await accountsPassword.createUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      });
      history.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Card>
        <CardContent className={classes.cardContent}>
          <form onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5">Sign up</Typography>
              </Grid>
            </Grid>

            <FormControl margin="normal">
              <InputLabel htmlFor="firstName">First name</InputLabel>
              <Input
                id="firstName"
                value={user.firstName}
                onChange={e => setUser(prevState => ({ ...prevState, firstName: e.target.value }))}
              />
            </FormControl>
            <FormControl margin="normal">
              <InputLabel htmlFor="lastName">Last name</InputLabel>
              <Input
                id="lastName"
                value={user.lastName}
                onChange={e => setUser(prevState => ({ ...prevState, lastName: e.target.value }))}
              />
            </FormControl>
            <FormControl margin="normal">
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                value={user.email}
                onChange={e => setUser(prevState => ({ ...prevState, email: e.target.value }))}
              />
            </FormControl>
            <FormControl margin="normal">
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type="password"
                value={user.password}
                onChange={e => setUser(prevState => ({ ...prevState, password: e.target.value }))}
              />
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              Sign Up
            </Button>
            {error && <FormError error={error!} />}
          </form>
          <Divider className={classes.divider} />
          <Link component={LogInLink}>Already have an account?</Link>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;
