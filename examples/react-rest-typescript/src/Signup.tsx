import React, { useState } from 'react';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Typography,
  makeStyles,
  CardContent,
  Card,
  Divider,
  Link,
  Grid,
  TextField,
  Snackbar,
} from '@material-ui/core';
import { useFormik, FormikErrors } from 'formik';
import { accountsPassword } from './accounts';
import { SnackBarContentError } from './components/SnackBarContentError';
import { UnauthenticatedContainer } from './components/UnauthenticatedContainer';

const useStyles = makeStyles((theme) => ({
  cardContent: {
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  logo: {
    maxWidth: '100%',
    width: 250,
  },
}));

const LogInLink = React.forwardRef<RouterLink, any>((props, ref) => (
  <RouterLink to="/login" {...props} ref={ref} />
));

interface SignupValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup = ({ history }: RouteComponentProps<{}>) => {
  const classes = useStyles();
  const [error, setError] = useState<string | undefined>();
  const formik = useFormik<SignupValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: FormikErrors<SignupValues> = {};
      if (!values.firstName) {
        errors.firstName = 'Required';
      }
      if (!values.lastName) {
        errors.lastName = 'Required';
      }
      if (!values.email) {
        errors.email = 'Required';
      }
      if (!values.password) {
        errors.password = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await accountsPassword.createUser({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });
        history.push('/login');
      } catch (error) {
        setError(error.message);
        setSubmitting(false);
      }
    },
  });

  return (
    <UnauthenticatedContainer>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={!!error}
        onClose={() => setError(undefined)}
      >
        <SnackBarContentError message={error} />
      </Snackbar>

      <Card>
        <CardContent className={classes.cardContent}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <img src="/logo.png" alt="Logo" className={classes.logo} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Sign up</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="First name"
                  variant="outlined"
                  fullWidth={true}
                  id="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.firstName && formik.touched.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last name"
                  variant="outlined"
                  fullWidth={true}
                  id="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.lastName && formik.touched.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth={true}
                  id="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.email && formik.touched.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth={true}
                  type="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.password && formik.touched.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
          <Divider className={classes.divider} />
          <Link component={LogInLink}>Already have an account?</Link>
        </CardContent>
      </Card>
    </UnauthenticatedContainer>
  );
};

export default Signup;
