import { Button, FormControl, Input, InputLabel, Typography } from '@material-ui/core';
import * as QRCode from 'qrcode.react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { accountsGraphQL } from './utils/accounts';

interface IState {
  secret: any;
  oneTimeCode: string;
}

class TwoFactor extends React.Component<RouteComponentProps<{}>, IState> {
  public state = {
    oneTimeCode: '',
    secret: null as any,
  };

  public async componentDidMount() {
    this.onGetTwoFactorSecret();
  }

  public onGetTwoFactorSecret = async () => {
    const secret = await accountsGraphQL.getTwoFactorSecret();
    if (secret) {
      const { __typename, ...secretFields } = secret;
      this.setState({ secret: secretFields });
    }
  };

  public onChangeOneTimeCode = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ oneTimeCode: target.value });
  };

  public onSetTwoFactor = async () => {
    try {
      await accountsGraphQL.twoFactorSet(this.state.secret, this.state.oneTimeCode);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      alert(err.message);
    }
  };

  public render() {
    const { secret, oneTimeCode } = this.state;
    if (!secret) {
      return null;
    }
    return (
      <div>
        <Typography gutterBottom={true}>Two-factor authentication</Typography>
        <Typography gutterBottom={true}>Backup code:</Typography>
        <Typography gutterBottom={true}>{secret.base32}</Typography>
        <Typography gutterBottom={true}>Use Google Authenticator for example</Typography>
        <QRCode value={secret.otpauth_url} />
        <Typography gutterBottom={true}>Confirm with one-time code:</Typography>
        <FormControl margin="normal">
          <InputLabel htmlFor="one-time-code">One time code</InputLabel>
          <Input id="one-time-code" value={oneTimeCode} onChange={this.onChangeOneTimeCode} />
        </FormControl>
        <Button onClick={this.onSetTwoFactor}>Submit</Button>
      </div>
    );
  }
}

export default TwoFactor;
