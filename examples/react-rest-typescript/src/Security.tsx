import { Typography, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TwoFactor } from './TwoFactor';
import { ChangePassword } from './ChangePassword';
import { AuthenticatedContainer } from './components/AuthenticatedContainer';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(2),
  },
}));

export const Security = () => {
  const classes = useStyles();

  return (
    <AuthenticatedContainer>
      <Typography variant="h5">Security</Typography>
      <Divider className={classes.divider} />
      <ChangePassword />
      <TwoFactor />
    </AuthenticatedContainer>
  );
};
