import React from 'react';

import { Button, Typography } from '@material-ui/core';
import Link from 'next/link';
import { accountsClient, accountsGraphQL } from '../utils/accounts';
import Router from 'next/router';
interface State {
  user?: any;
}

class Home extends React.Component<State> {
  public state = {
    user: null as any,
  };
  // use getInitialProps where LocalStorage is not available.
  // public async componentDidMount() {
  //   // refresh the session to get a new accessToken if expired
  //   const tokens = await accountsClient.refreshSession();
  //   if (!tokens) {
  //     Router.push('/login');
  //     return;
  //   }
  //   const user = await accountsGraphQL.getUser();
  //   await this.setState({ user });
  // }

  public onResendEmail = async () => {
    const { user } = this.state;
    await accountsGraphQL.sendVerificationEmail(user.emails[0].address);
  };

  public onLogout = async () => {
    await accountsClient.logout();
    Router.push('/login');
  };

  public render() {
    const { user } = this.state;
    if (!user) {
      return null;
    }

    return (
      <div>
        <Typography gutterBottom={true}>You are logged in</Typography>
        <Typography gutterBottom={true}>Email: {user.emails[0].address}</Typography>
        <Typography gutterBottom={true}>
          You email is {user.emails[0].verified ? 'verified' : 'unverified'}
        </Typography>
        {!user.emails[0].verified && (
          <Button onClick={this.onResendEmail}>Resend verification email</Button>
        )}
        <Link href="two-factor">
          <a>Set up 2fa</a>
        </Link>
        <Button variant="outlined" color="primary" onClick={this.onLogout}>
          Logout
        </Button>
      </div>
    );
  }
}

export default Home;
