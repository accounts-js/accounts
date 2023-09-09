import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tooltip,
  IconButton,
  CardActions,
  Button,
  Grid,
  TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SendIcon from '@mui/icons-material/Send';
import { useFormik, FormikErrors } from 'formik';
import { User } from '@accounts/types';
import { accountsClient, accountsRest, accountsPassword } from './accounts';
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
    minHeight: 48,
  },
  emailItemPart: {
    display: 'flex',
  },
  emailItemDot: {
    marginRight: theme.spacing(2),
  },
}));

interface AddEmailValues {
  newEmail: string;
}

export const Email = () => {
  const classes = useStyles();
  const [user, setUser] = useState<User>();
  const formik = useFormik<AddEmailValues>({
    initialValues: {
      newEmail: '',
    },
    validate: (values) => {
      const errors: FormikErrors<AddEmailValues> = {};
      if (!values.newEmail) {
        errors.newEmail = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await accountsPassword.addEmail(values.newEmail);
        await fetchUser();
        alert('New email added');
      } catch (error) {
        alert(error);
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const user = await accountsClient.getUser();
    setUser(user);
  };

  const onResendEmail = async (address: string) => {
    await accountsRest.sendVerificationEmail(address);
    alert('Verification email sent');
  };

  if (!user) {
    return <AuthenticatedContainer>Loading ...</AuthenticatedContainer>;
  }
  return (
    <AuthenticatedContainer>
      <Typography variant="h5">Emails</Typography>
      <Divider className={classes.divider} />
      <Card className={classes.card}>
        <CardHeader subheader="Emails" className={classes.cardHeader} />
        <Divider />
        <CardContent className={classes.cardContent}>
          {user.emails &&
            user.emails.map((email) => (
              <div key={email.address} className={classes.emailItem}>
                <div className={classes.emailItemPart}>
                  <Tooltip
                    arrow
                    placement="top-start"
                    title={
                      email.verified ? 'Your email is verified' : 'You need to verify your email'
                    }
                  >
                    <FiberManualRecordIcon
                      className={classes.emailItemDot}
                      color={email.verified ? 'secondary' : 'error'}
                    />
                  </Tooltip>
                  <Typography>{email.address}</Typography>
                </div>
                {!email.verified && (
                  <Tooltip arrow placement="top-end" title="Resend verification email">
                    <IconButton
                      aria-label="Send"
                      onClick={() => onResendEmail(email.address)}
                      size="large"
                    >
                      <SendIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            ))}
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <form onSubmit={formik.handleSubmit}>
          <CardHeader subheader="Add secondary emails" className={classes.cardHeader} />
          <Divider />
          <CardContent className={classes.cardContent}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Add email address"
                  variant="outlined"
                  fullWidth={true}
                  id="newEmail"
                  type="email"
                  value={formik.values.newEmail}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.newEmail && formik.touched.newEmail)}
                  helperText={formik.touched.newEmail && formik.errors.newEmail}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions className={classes.cardActions}>
            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
              Add email
            </Button>
          </CardActions>
        </form>
      </Card>
    </AuthenticatedContainer>
  );
};
