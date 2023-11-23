import { Container } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
    },
  },
}));

interface UnauthenticatedContainerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}

export const UnauthenticatedContainer = ({ children }: UnauthenticatedContainerProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="sm" className={classes.container}>
        {children}
      </Container>
    </div>
  );
};
