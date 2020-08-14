import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CardActions,
  TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useHistory } from 'react-router';
import QRCode from 'qrcode.react';
import { useFormik, FormikErrors } from 'formik';
import { accountsClient, accountsRest } from './accounts';
import { AuthenticatedContainer } from './components/AuthenticatedContainer';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(2),
  },
  card: {
    marginTop: theme.spacing(3),
  },
  cardHeader: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  cardActions: {
    padding: theme.spacing(3),
  },
  qrCode: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  alertError: {
    marginTop: theme.spacing(2),
  },
}));

interface OTP {
  mfaToken: string;
  id: string;
  secret: string;
}

interface TwoFactorOtpValues {
  oneTimeCode: string;
}

export const TwoFactorOtp = () => {
  const classes = useStyles();
  const history = useHistory();
  const [secret, setSecret] = useState<OTP>();
  const [error, setError] = useState<string>();
  const formik = useFormik<TwoFactorOtpValues>({
    initialValues: {
      oneTimeCode: '',
    },
    validate: (values) => {
      const errors: FormikErrors<TwoFactorOtpValues> = {};
      if (!values.oneTimeCode) {
        errors.oneTimeCode = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!secret) return;

      try {
        await accountsRest.loginWithService('mfa', {
          mfaToken: secret.mfaToken,
          code: values.oneTimeCode,
        });
        history.push('/security');
      } catch (error) {
        setError(error.message);
      }
      setSubmitting(false);
    },
  });

  const fetchTwoFactorSecret = async () => {
    // TODO try catch and show error if needed
    const data = await accountsClient.mfaAssociate('otp');
    setSecret(data);
  };

  useEffect(() => {
    fetchTwoFactorSecret();
  }, []);

  if (!secret) {
    return null;
  }

  const otpauthUri = `otpauth://totp/accounts-js?secret=${secret.secret}&issuer=accounts-js`;

  return (
    <AuthenticatedContainer>
      <Typography variant="h5">Authenticator App</Typography>
      <Divider className={classes.divider} />
      <Card className={classes.card}>
        <form onSubmit={formik.handleSubmit}>
          <CardHeader subheader="Configuration" className={classes.cardHeader} />
          <Divider />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom>Authenticator secret: {secret.secret}</Typography>
            <QRCode className={classes.qrCode} value={otpauthUri} />
            <TextField
              label="Authenticator code"
              variant="outlined"
              fullWidth={true}
              className={classes.textField}
              id="oneTimeCode"
              value={formik.values.oneTimeCode}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.oneTimeCode && formik.touched.oneTimeCode)}
              helperText={
                formik.touched.oneTimeCode && formik.errors.oneTimeCode
                  ? formik.errors.oneTimeCode
                  : 'Scan the code with your Two-Factor app and enter the one time password to confirm'
              }
            />
            {error && (
              <Alert severity="error" className={classes.alertError}>
                {error}
              </Alert>
            )}
          </CardContent>
          <Divider />
          <CardActions className={classes.cardActions}>
            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
              Submit
            </Button>
          </CardActions>
        </form>
      </Card>
    </AuthenticatedContainer>
  );
};
