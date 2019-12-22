import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Typography, Container, makeStyles, Link } from '@material-ui/core';
import { accountsRest } from './accounts';
import FormError from './components/FormError';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    textAlign: 'center',
  },
  link: {
    marginTop: theme.spacing(1),
    display: 'block',
  },
}));

const HomeLink = React.forwardRef<RouterLink, any>((props, ref) => (
  <RouterLink to="/" {...props} ref={ref} />
));

const VerifyEmail = () => {
  const classes = useStyles();
  const match = useParams<{ token: string }>();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmail = async () => {
    try {
      await accountsRest.verifyEmail(match.token);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="md" className={classes.container}>
      {error && <FormError error={error!} />}
      {success && <Typography color="primary">Your email has been verified</Typography>}
      <Link component={HomeLink} className={classes.link}>
        Go Home
      </Link>
    </Container>
  );
};

export default VerifyEmail;
