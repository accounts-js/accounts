import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { accountsRest } from './accounts';
import FormError from './components/FormError';
import { UnauthenticatedContainer } from './components/UnauthenticatedContainer';

const useStyles = makeStyles((theme) => ({
  link: {
    marginTop: theme.spacing(1),
    display: 'block',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UnauthenticatedContainer>
      {error && <FormError error={error!} />}
      {success && <Typography color="primary">Your email has been verified</Typography>}
      <Link component={HomeLink} className={classes.link}>
        Go Home
      </Link>
    </UnauthenticatedContainer>
  );
};

export default VerifyEmail;
