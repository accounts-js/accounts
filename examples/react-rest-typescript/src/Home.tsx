import React, { useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Grid,
  CardActions,
  Button,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useFormik, FormikErrors } from 'formik';
import { accountsClient } from './accounts';
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
  emailItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailItemPart: {
    display: 'flex',
  },
  emailItemDot: {
    marginRight: theme.spacing(2),
  },
}));

interface AccountDetailsValues {
  firstName: string;
  lastName: string;
}

const Home = () => {
  const classes = useStyles();
  const formik = useFormik<AccountDetailsValues>({
    initialValues: {
      firstName: '',
      lastName: '',
    },
    validate: (values) => {
      const errors: FormikErrors<AccountDetailsValues> = {};
      if (!values.firstName) {
        errors.firstName = 'Required';
      }
      if (!values.lastName) {
        errors.lastName = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const tokens = await accountsClient.refreshSession();
        if (tokens) {
          await fetch(`${process.env.REACT_APP_API_URL}/user`, {
            method: 'PUT',
            headers: {
              Authorization: tokens ? 'Bearer ' + tokens.accessToken : '',
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: values.firstName,
              lastName: values.lastName,
            }),
          });
          alert('Profile updated');
        }
      } catch (error) {
        alert(error);
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      // refresh the session to get a new accessToken if expired
      const tokens = await accountsClient.refreshSession();
      if (tokens) {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
          headers: {
            Authorization: tokens ? 'Bearer ' + tokens.accessToken : '',
          },
        });
        const data = await res.json();
        formik.setValues({ firstName: data.user.firstName, lastName: data.user.lastName });
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthenticatedContainer>
      <Typography variant="h5">Account Details</Typography>
      <Divider className={classes.divider} />
      <Card className={classes.card}>
        <form onSubmit={formik.handleSubmit}>
          <CardHeader subheader="Account Details" className={classes.cardHeader} />
          <Divider />
          <CardContent className={classes.cardContent}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
            </Grid>
          </CardContent>
          <Divider />
          <CardActions className={classes.cardActions}>
            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
              Update profile
            </Button>
          </CardActions>
        </form>
      </Card>
    </AuthenticatedContainer>
  );
};

export default Home;
