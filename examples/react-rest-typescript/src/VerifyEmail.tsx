import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';

import { accountsRest } from './accounts';
import FormError from './components/FormError';

const HomeLink = (props: any) => <Link to="/" {...props} />;

interface RouteMatchProps {
  token: string;
}

interface State {
  success: boolean;
  error: string | null;
}

class VerifyEmail extends React.Component<RouteComponentProps<RouteMatchProps>, State> {
  state = {
    success: false,
    error: null,
  };

  async componentDidMount() {
    try {
      await accountsRest.verifyEmail(this.props.match.params.token);
      this.setState({ success: true });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  render() {
    const { error, success } = this.state;
    return (
      <div>
        {error && <FormError error={error} />}
        {success && <Typography>Your email has been verified</Typography>}
        <Button component={HomeLink}>Go Home</Button>
      </div>
    );
  }
}

export default VerifyEmail;
