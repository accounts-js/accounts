import React from 'react';
import { Button, Typography } from '@material-ui/core';
import Link from 'next/link';
// import Router from "next/router";
import FormError from '../components/FormError';
import { accountsGraphQL } from '../utils/accounts';

// const HomeLink = (props: any) => <Link to="/" {...props} />;

interface Token {
  token: any;
}

interface State {
  success: boolean;
  error: string | null;
}

class VerifyEmail extends React.Component<Token, State> {
  public state = {
    error: null,
    success: false,
  };

  public async componentDidMount() {
    try {
      await accountsGraphQL.verifyEmail('fix@me.com');
      this.setState({ success: true });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  public render() {
    const { error, success } = this.state;
    return (
      <div>
        {error && <FormError error={error!} />}
        {success && <Typography>Your email has been verified</Typography>}
        <Button>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }
}

export default VerifyEmail;
