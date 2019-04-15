import 'antd/lib/date-picker/style/css';

import * as React from 'react';

import { Button, Form, Icon, Input, message } from 'antd';

// import { Auth } from '../../stores/auth';
// import { ContentTypes } from '../../stores/contentTypes';
import { FormComponentProps } from 'antd/lib/form';
import { Link } from 'react-router-dom';

// import FormError from './components/FormError';
// import { accountsPassword } from './utils/accounts';
// import { connect } from '../../typeorm-server-typescript/src/conn';

// import { Link, RouteComponentProps } from 'react-router-dom';

// const styles = () => ({
//   formContainer: {
//     display: 'flex',
//     flexDirection: 'column' as 'column',
//   },
// });

// const SignUpLink = (props: any) => <Link to="/signup" {...props} />;
// const ResetPasswordLink = (props: any) => <Link to="/reset-password" {...props} />;

// interface IState {
//   email: string;
//   password: string;
//   code: string;
//   error: string | null;
// }

// class Login extends React.Component<WithStyles<'formContainer'> & RouteComponentProps<{}>, IState> {
//   public state = {
//     code: '',
//     email: '',
//     error: null,
//     password: '',
//   };

//   public onChangeEmail = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({ email: target.value });
//   };

//   public onChangePassword = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({ password: target.value });
//   };

//   public onChangeCode = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({ code: target.value });
//   };

//   public onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     this.setState({ error: null });
//     try {
//       await accountsPassword.login({
//         code: this.state.code,
//         password: this.state.password,
//         user: {
//           email: this.state.email,
//         },
//       });
//       this.props.history.push('/');
//     } catch (err) {
//       this.setState({ error: err.message });
//     }
//   };

//   public render() {
//     const { classes } = this.props;
//     const { email, password, code, error } = this.state;
//     return (
//       <form onSubmit={this.onSubmit} className={classes.formContainer}>
//         <Typography variant="display1" gutterBottom={true}>
//           Login
//         </Typography>
//         <FormControl margin="normal">
//           <InputLabel htmlFor="email">Email</InputLabel>
//           <Input id="email" value={email} autoComplete="email" onChange={this.onChangeEmail} />
//         </FormControl>
//         <FormControl margin="normal">
//           <InputLabel htmlFor="password">Password</InputLabel>
//           <Input
//             id="password"
//             type="password"
//             value={password}
//             autoComplete="current-password"
//             onChange={this.onChangePassword}
//           />
//         </FormControl>
//         <FormControl margin="normal">
//           <InputLabel htmlFor="password">2fa code if enabled</InputLabel>
//           <Input id="code" value={code} onChange={this.onChangeCode} />
//         </FormControl>
//         <Button variant="raised" color="primary" type="submit">
//           Login
//         </Button>
//         {error && <FormError error={error} />}
//         <Button component={SignUpLink}>Sign Up</Button>
//         <Button component={ResetPasswordLink}>Reset Password</Button>
//       </form>
//     );
//   }
// }

// export default withStyles(styles)(Login);

class LoginBase extends React.Component<FormComponentProps> {
  public onSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    // const values: any = this.props.form.getFieldsValue();
    try {
      // await Auth.login(values.email, values.password);

      (this.props as any).history.push('/');
    } catch (err) {
      message.error('Invalid email or password');
    }
    return false;
  };

  public render() {
    // if (Auth.isSetup) {
    //   return <Redirect to="/setup" />;
    // }

    const { getFieldDecorator } = this.props.form;
    return (
      <div
        style={{
          height: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
        }}
      >
        <Form
          onSubmit={this.onSubmit}
          style={{ width: 300 }}
          action="/login"
          autoComplete="prime-login"
        >
          <div style={{ color: 'black', fontSize: 24, marginBottom: 16, fontFamily: 'system' }}>
            accounts-JS Login
          </div>
          <Form.Item style={{ padding: '10px 0 10px 0' }}>
            {getFieldDecorator('email')(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                autoComplete="prime-email"
              />
            )}
          </Form.Item>
          <Form.Item style={{ padding: '10px 0 10px 0' }}>
            {getFieldDecorator('password')(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                autoComplete="prime-password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type={'primary' as any} htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
          <div style={{ padding: '10px 0 10px 0' }}>
            <Link to="/reset-password">Reset password</Link>
          </div>
          <div style={{ padding: '10px 0 10px 0' }}>
            <Link to="/signup">Sign up</Link>
          </div>
        </Form>
      </div>
    );
  }
}

export const Login = Form.create()(LoginBase);
