import { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CardActions,
  TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import QRCode from 'qrcode.react';
import { useFormik, FormikErrors } from 'formik';
import { accountsRest } from './accounts';
import { type GeneratedSecret } from '@levminer/speakeasy';

const useStyles = makeStyles((theme) => ({
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
}));

interface TwoFactorValues {
  oneTimeCode: string;
}

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export const TwoFactor = () => {
  const classes = useStyles();
  const [secret, setSecret] = useState<WithRequired<GeneratedSecret, 'otpauth_url'>>();
  const formik = useFormik<TwoFactorValues>({
    initialValues: {
      oneTimeCode: '',
    },
    validate: (values) => {
      const errors: FormikErrors<TwoFactorValues> = {};
      if (!values.oneTimeCode) {
        errors.oneTimeCode = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await accountsRest.twoFactorSet(secret, values.oneTimeCode);
        // TODO success message
      } catch (error) {
        // TODO snackbar?
        alert(error);
      }
      setSubmitting(false);
    },
  });

  const fetchTwoFactorSecret = async () => {
    const data = await accountsRest.getTwoFactorSecret();
    setSecret(data.secret);
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
          <Typography gutterBottom>Authenticator secret: {secret.base32}</Typography>
          <QRCode className={classes.qrCode} value={secret.otpauth_url} />
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
