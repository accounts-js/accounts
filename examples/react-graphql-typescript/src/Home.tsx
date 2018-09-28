import { Button, Typography } from '@material-ui/core';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { accountsClient, accountsGraphQL } from './utils/accounts';

interface IState {
  user: any;
}

class Home extends React.Component<RouteComponentProps<{}>, IState> {
  public state = {
    user: null as any,
  };

  public async componentDidMount() {
    // refresh the session to get a new accessToken if expired
    const tokens = await accountsClient.refreshSession();
    if (!tokens) {
      this.props.history.push('/login');
      return;
    }
    const user = await accountsGraphQL.getUser(tokens ? tokens.accessToken : '');
    await this.setState({ user });
  }

  public onResendEmail = async () => {
    const { user } = this.state;
    await accountsGraphQL.sendVerificationEmail(user.emails[0].address);
  };

  public onLogout = async () => {
    await accountsClient.logout();
    this.props.history.push('/login');
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

        <Link to="two-factor">Set up 2fa</Link>

        <Button variant="raised" color="primary" onClick={this.onLogout}>
          Logout
        </Button>
      </div>
    );
  }
}

export default Home;
