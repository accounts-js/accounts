import { merge, trim, isEmpty, isFunction } from 'lodash';
import React from 'react';
import {
  branch,
  compose,
  lifecycle,
  renderNothing,
  withHandlers,
  withStateHandlers,
} from 'recompose';
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { User } from '@accounts/types';

const isEmail = (email?: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return Boolean(email && re.test(email));
};

export interface AccountsContextInterface {
  handleChangeUser: any;
  handleClearSignInErrors: any;
  signIn: any;
  signUp: any;
  client: AccountsClient;
  password?: AccountsClientPassword;
  options: any;
  labels: any;
  components: any;
  view: string;
  handleChangeView: (view) => void;
  handleChangeSignInField: (name: string, value?: string | null, error?: string | null) => void;
  handleChangeSignInError: (error?: string | null) => void;
  handleChangeSignUpField: (name: string, value?: string | null, error?: string | null) => void;
  handleChangeSignUpError: (error?: string | null) => void;
  handleSignInClicked: () => void;
  handleSignUpClicked: () => void;
  user?: User;
}

const AccountsContext = React.createContext<AccountsContextInterface>({
  user: null,
} as any);

const defaultLabels = {
  user: 'Username or email',
  password: 'Password',
  signIn: 'Sign in',
  signUp: 'Sign up',
};

const defaultComponents = {
  Wrapper: ({ children }) => children,
};

export interface Components {
  Wrapper: React.ReactNode;
}

const defaultOptions = {};

const formatError = error => {
  return error.replace('GraphQL error:', '').trim();
};

// const foundComponents = [
//   '@accounts/react-material-ui'
// ].reduce(((res, curr) => {
//   const requiredPackage = require(`${curr}`).default;
//   if (requiredPackage) {
//     return requiredPackage;
//   }
// }), {});

let AccountsProvider: React.SFC<any> = ({
  children,
  labels,
  components,
  options,
  ...otherProps
}) => {
  const mergedLabels = merge(defaultLabels, labels);
  const mergedOptions = merge(defaultOptions, options);

  const mergedComponents = merge(defaultComponents, components);

  return (
    <AccountsContext.Provider
      value={
        {
          options: mergedOptions,
          components: mergedComponents,
          labels: mergedLabels,
          ...otherProps,
        } as any
      }
    >
      {children}
    </AccountsContext.Provider>
  );
};

AccountsProvider = compose(
  withStateHandlers(
    props => ({
      view: props.view || 'signIn',
      serverOptionsLoaded: false,
      user: null,
      signIn: {
        fields: {
          user: {
            value: '',
            error: null,
          },
          password: {
            value: '',
            error: null,
          },
        },
        error: null,
      },
      signUp: {
        fields: {
          user: {
            value: '',
            error: null,
          },
          password: {
            value: '',
            error: null,
          },
        },
        error: null,
      },
    }),
    {
      handleChangeUser: () => user => {
        return { user };
      },
      handleChangeView: () => view => ({
        view,
      }),
      setOptions: () => options => ({
        options,
      }),
      serverOptionsLoaded: () => ({ serverOptionsLoaded }) => ({
        serverOptionsLoaded,
      }),
      handleChangeSignInField: state => (name, value, error) => {
        return merge(state, {
          signIn: {
            fields: {
              [name]: {
                value,
                error,
              },
            },
          },
        });
      },
      handleChangeSignInError: state => error => {
        return merge(state, {
          signIn: {
            error,
          },
        });
      },
      handleChangeSignUpField: state => (name, value, error) => {
        return merge(state, {
          signUp: {
            fields: {
              [name]: {
                value,
                error,
              },
            },
          },
        });
      },
      handleChangeSignUpError: state => error => {
        return merge(state, {
          signUp: {
            error,
          },
        });
      },
      handleClearSignInErrors: state => () => {
        return merge(state, {
          signIn: {
            error: null,
            fields: Object.keys(state.signIn.fields).reduce((res, curr) => {
              return {
                ...res,
                [curr]: {
                  error: null,
                },
              };
            }, {}),
          },
        });
      },
      handleClearSignUpErrors: state => () => {
        return merge(state, {
          signUp: {
            error: null,
            fields: Object.keys(state.signUp.fields).reduce((res, curr) => {
              return {
                ...res,
                [curr]: {
                  error: null,
                },
              };
            }, {}),
          },
        });
      },
    }
  ),
  withHandlers({
    handleSignInClicked: (props: AccountsContextInterface) => () => {
      props.handleClearSignInErrors();

      const email =
        !isEmpty(trim(props.signIn.fields.user.value)) &&
        isEmail(props.signIn.fields.user.value) &&
        props.signIn.fields.user.value;

      const username = props.signIn.fields.user.value;

      if (isEmpty(trim(username)) && !email) {
        props.handleChangeSignInField('user', undefined, 'Username or email is required');
        return;
      }

      const password = props.signIn.fields.password.value;

      if (isEmpty(trim(password))) {
        props.handleChangeSignInField('password', undefined, 'Password is required');
        return;
      }

      props.client
        .loginWithService('password', {
          user: {
            email,
            username,
          },
          password,
        })
        .then(() => {
          return props.client.getUser();
        })
        .then(user => {
          props.handleChangeUser(user);
        })
        .catch(error => {
          props.handleChangeSignInError(formatError(error.message));
        });
    },
  }),
  branch(
    props => !props.serverOptionsLoaded,
    lifecycle({
      async componentDidMount() {
        const { client, options } = this.props;
        const serverOptions = await client.getAccountsOptions();
        this.props.serverOptionsLoaded(true);
        this.props.setOptions(merge(serverOptions, options));
      },
    })
  ),
  branch(props => !props.serverOptionsLoaded, renderNothing)
)(AccountsProvider);

export { AccountsProvider };

export const AccountsConsumer = AccountsContext.Consumer;

export const Accounts: React.SFC<any> = () => (
  <AccountsConsumer>
    {({
      view,
      components,
      handleChangeSignInField,
      handleChangeSignUpField,
      handleSignInClicked,
      handleChangeView,
      signIn,
      signUp,
    }: AccountsContextInterface) => {
      return (
        <components.Wrapper>
          {view === 'signIn' && (
            <components.SignIn.Form>
              <components.SignIn.Fields>
                <components.SignIn.UserField
                  handleChange={e => handleChangeSignInField(e.target.name, e.target.value)}
                  error={signIn.fields.user.error}
                />
                <components.SignIn.PasswordField
                  handleChange={e => handleChangeSignInField(e.target.name, e.target.value)}
                  error={signIn.fields.password.error}
                />
              </components.SignIn.Fields>
              <components.Error error={signIn.error} />
              <components.SignIn.Actions>
                <components.SignIn.SignUpButton onClick={() => handleChangeView('signUp')} />
                <components.SignIn.SignInButton onClick={handleSignInClicked} />
              </components.SignIn.Actions>
            </components.SignIn.Form>
          )}
          {view === 'signUp' && (
            <components.SignUp.Form>
              <components.SignUp.Fields>
                <components.SignUp.UserField
                  handleChange={e => handleChangeSignUpField(e.target.name, e.target.value)}
                  error={signUp.fields.user.error}
                />
                <components.SignUp.PasswordField
                  handleChange={e => handleChangeSignUpField(e.target.name, e.target.value)}
                  error={signUp.fields.password.error}
                />
              </components.SignUp.Fields>
              <components.Error error={signIn.error} />
              <components.SignUp.Actions>
                <components.SignUp.SignInButton onClick={() => handleChangeView('signIn')} />
                <components.SignUp.SignUpButton />
              </components.SignUp.Actions>
            </components.SignUp.Form>
          )}
        </components.Wrapper>
      );
    }}
  </AccountsConsumer>
);

export const Auth = ({ children }) => (
  <AccountsConsumer>
    {(context: AccountsContextInterface) => {
      if (context.user) {
        return isFunction(children) ? children(context) : children;
      }
    }}
  </AccountsConsumer>
);
