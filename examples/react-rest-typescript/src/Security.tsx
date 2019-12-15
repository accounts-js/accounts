import React from 'react';
import {
  makeStyles,
  Container,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  TextField,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';
import { useFormik, FormikErrors } from 'formik';
import { accountsPassword } from './accounts';
import { TwoFactor } from './TwoFactor';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
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
}));

interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const Security = () => {
  const classes = useStyles();
  const formik = useFormik<ChangePasswordValues>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: values => {
      const errors: FormikErrors<ChangePasswordValues> = {};
      if (!values.oldPassword) {
        errors.oldPassword = 'Required';
      }
      if (!values.newPassword) {
        errors.newPassword = 'Required';
      }
      if (!values.confirmNewPassword) {
        errors.confirmNewPassword = 'Required';
      }
      if (!errors.confirmNewPassword && values.newPassword !== values.confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await accountsPassword.changePassword(values.oldPassword, values.newPassword);
        // TODO success message
      } catch (error) {
        // TODO snackbar?
        alert(error);
      }
      setSubmitting(false);
    },
  });

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h5">Security</Typography>
      <Card className={classes.card}>
        <form onSubmit={formik.handleSubmit}>
          <CardHeader subheader="Change password" className={classes.cardHeader} />
          <Divider />
          <CardContent className={classes.cardContent}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Old password"
                  variant="outlined"
                  fullWidth={true}
                  type="password"
                  id="oldPassword"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.oldPassword && formik.touched.oldPassword)}
                  helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
                  helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions className={classes.cardActions}>
            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
              Update password
            </Button>
          </CardActions>
        </form>
      </Card>

      <TwoFactor />
    </Container>
  );
};
