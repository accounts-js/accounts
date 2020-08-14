import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Typography,
  makeStyles,
  Card,
  CardContent,
  TextField,
  Grid,
  Snackbar,
} from '@material-ui/core';
import { useFormik, FormikErrors } from 'formik';
import { SnackBarContentError } from './components/SnackBarContentError';
import { useAuth } from './components/AuthContext';
import { UnauthenticatedContainer } from './components/UnauthenticatedContainer';
import { accountsClient } from './accounts';

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

interface LoginMfaProps {
  mfaToken: string;
}

interface LoginMfaValues {
  code: string;
}

export const LoginMfa = ({ mfaToken }: LoginMfaProps) => {
  const classes = useStyles();
  const history = useHistory();
  const { loginWithService } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const formik = useFormik<LoginMfaValues>({
    initialValues: {
      code: '',
    },
    validate: (values) => {
      const errors: FormikErrors<LoginMfaValues> = {};
      if (!values.code) {
        errors.code = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await loginWithService('mfa', {
          mfaToken,
          code: values.code,
        });
        history.push('/');
      } catch (error) {
        setError(error.message);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchAuthenticators = async () => {
      // TODO try catch
      const data = await accountsClient.authenticatorsByMfaToken(mfaToken);
      console.log(data);
      const authenticator = data[0];
      const challengeResponse = await accountsClient.mfaChallenge(mfaToken, authenticator.id);
      // console.log(challengeResponse);
    };

    fetchAuthenticators();
  }, [mfaToken]);

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
                <Typography variant="h5">Two-factor authentication</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Your account is protected by two-factor authentication. To verify your identity
                  you need to provide the access code from your authenticator app.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Authenticator code"
                  variant="outlined"
                  fullWidth={true}
                  id="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.code && formik.touched.code)}
                  helperText={formik.touched.code && formik.errors.code}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Sign in
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </UnauthenticatedContainer>
  );
};
