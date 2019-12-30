import React, { useState, useEffect } from 'react';
import {
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import SendIcon from '@material-ui/icons/Send';
import { accountsClient, accountsRest } from './accounts';
import { AuthenticatedContainer } from './components/AuthenticatedContainer';

const useStyles = makeStyles(theme => ({
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

export const Email = () => {
  const classes = useStyles();
  const [user, setUser] = useState();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    const user = await accountsClient.getUser();
    setUser(user);
  };

  const onResendEmail = async () => {
    await accountsRest.sendVerificationEmail(user.emails[0].address);
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
          {user.emails.map((email: any, index: number) => (
            <div key={index} className={classes.emailItem}>
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
                  <IconButton aria-label="Send" onClick={onResendEmail}>
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </AuthenticatedContainer>
  );
};
