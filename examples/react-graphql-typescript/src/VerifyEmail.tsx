import { Button, Typography } from '@material-ui/core';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import FormError from './components/FormError';
import { accountsGraphQL } from './utils/accounts';

const HomeLink = (props: any) => <Link to="/" {...props} />;

interface IRouteMatchProps {
  token: string;
}

interface IState {
  success: boolean;
  error: string | null;
}

class VerifyEmail extends React.Component<RouteComponentProps<IRouteMatchProps>, IState> {
  public state = {
    error: null,
    success: false,
  };

  public async componentDidMount() {
    try {
      await accountsGraphQL.verifyEmail(this.props.match.params.token);
      this.setState({ success: true });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  public render() {
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
