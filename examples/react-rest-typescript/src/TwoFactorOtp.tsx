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
import QRCode from 'qrcode.react';
import { useFormik, FormikErrors } from 'formik';
import { accountsClient, accountsRest } from './accounts';

const useStyles = makeStyles(theme => ({
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
  otpauthUri: string;
  secret: string;
}

interface TwoFactorOtpValues {
  oneTimeCode: string;
}

export const TwoFactorOtp = () => {
  const classes = useStyles();
  const [secret, setSecret] = useState<OTP>();
  const [error, setError] = useState<string>();
  const formik = useFormik<TwoFactorOtpValues>({
    initialValues: {
      oneTimeCode: '',
    },
    validate: values => {
      const errors: FormikErrors<TwoFactorOtpValues> = {};
      if (!values.oneTimeCode) {
        errors.oneTimeCode = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!secret) return;

      try {
        const res = await accountsRest.loginWithService('mfa', {
          mfaToken: secret.mfaToken,
          code: values.oneTimeCode,
        });
        console.log(res);
        // TODO success message
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
  return (
    <Card className={classes.card}>
      <form onSubmit={formik.handleSubmit}>
        <CardHeader subheader="Two-factor authentication" className={classes.cardHeader} />
        <Divider />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom>Authenticator secret: {secret.secret}</Typography>
          <QRCode className={classes.qrCode} value={secret.otpauthUri} />
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
  );
};
