import React, { useState } from 'react';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Typography,
  Snackbar,
  makeStyles,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
  Link,
} from '@material-ui/core';
import { useFormik, FormikErrors } from 'formik';
import { accountsRest } from './accounts';
import { SnackBarContentError } from './components/SnackBarContentError';
import { SnackBarContentSuccess } from './components/SnackBarContentSuccess';
import { UnauthenticatedContainer } from './components/UnauthenticatedContainer';

const useStyles = makeStyles((theme) => ({
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

interface RouteMatchProps {
  token: string;
}

interface ResetPasswordValues {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPassword = ({ match }: RouteComponentProps<RouteMatchProps>) => {
  const classes = useStyles();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const formik = useFormik<ResetPasswordValues>({
    initialValues: {
      email: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: (values) => {
      const errors: FormikErrors<ResetPasswordValues> = {};
      if (!match.params.token) {
        if (!values.email) {
          errors.email = 'Required';
        }
      } else {
        if (!values.newPassword) {
          errors.newPassword = 'Required';
        }
        if (!values.confirmNewPassword) {
          errors.confirmNewPassword = 'Required';
        }
        if (!errors.confirmNewPassword && values.newPassword !== values.confirmNewPassword) {
          errors.confirmNewPassword = 'Passwords do not match';
        }
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!match.params.token) {
          await accountsRest.sendResetPasswordEmail(values.email);
          setSuccess('Email sent');
        } else {
          await accountsRest.resetPassword(match.params.token, values.newPassword);
          setSuccess('Your password has been reset successfully');
        }
      } catch (error) {
        setError(error.message);
      }
      setSubmitting(false);
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
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={!!success}
        onClose={() => setSuccess(undefined)}
      >
        <SnackBarContentSuccess message={success} />
      </Snackbar>

      <Card>
        <CardContent className={classes.cardContent}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5">Reset your password</Typography>
                {!match.params.token && (
                  <Typography variant="body2">
                    We will send a confirmation email to this address:
                  </Typography>
                )}
              </Grid>
              {!match.params.token && (
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
              )}
              {match.params.token && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <TextField
                      label="New password"
                      variant="outlined"
                      fullWidth={true}
                      type="password"
                      id="newPassword"
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.newPassword && formik.touched.newPassword)}
                      helperText={formik.touched.newPassword && formik.errors.newPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirm new password"
                      variant="outlined"
                      fullWidth={true}
                      type="password"
                      id="confirmNewPassword"
                      value={formik.values.confirmNewPassword}
                      onChange={formik.handleChange}
                      error={Boolean(
                        formik.errors.confirmNewPassword && formik.touched.confirmNewPassword
                      )}
                      helperText={
                        formik.touched.confirmNewPassword && formik.errors.confirmNewPassword
                      }
                    />
                  </Grid>
                </React.Fragment>
              )}
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  {!match.params.token ? 'Send email' : 'Reset password'}
                </Button>
              </Grid>
            </Grid>
          </form>
          <Divider className={classes.divider} />
          <Link component={LogInLink}>Login</Link>
        </CardContent>
      </Card>
    </UnauthenticatedContainer>
  );
};

export default ResetPassword;
