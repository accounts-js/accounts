import { merge, trim, isEmpty, isFunction, set, get } from 'lodash';
import React, { Children } from 'react';
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
import { ApolloClient } from 'apollo-client';

const isEmail = (email?: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return Boolean(email && re.test(email));
};

const defaultLabels = {
  user: 'Username or email',
  password: 'Password',
  signIn: 'Sign in',
  signUp: 'Sign up',
};

const defaultComponents = {
  Wrapper: ({ children }) => children,
};

const defaultOptions = {};

const formatError = error => {
  return error.replace('GraphQL error:', '').trim();
};

export interface Accounts {
  apollo?: ApolloClient<any>;
  client: AccountsClient;
  link?: any;
  password?: AccountsClientPassword;
}

export interface AccountsContext {
  labels: any;
  options: any;
  components: any;
  state: AccountsState;
  handlers: AccountsHandlers;
  accounts: Accounts;
  user?: User;
}

export interface AccountsHandlers {
  handleChangeState: (path: string, state: any) => void;
  handleSignInClicked: () => void;
  handleClearErrors: (form: string) => void;
  handleResetForm: (form: string) => void;
}

export interface Form {
  fields: {
    [field: string]: {
      value: string;
      error?: string;
    };
  };
  error?: string;
}

export interface AccountsState {
  view: string;
  serverOptionsLoaded: boolean;
  user?: User;
  signIn: Form;
  signUp: Form;
}

const AccountsContext = React.createContext<AccountsContext>({} as any);

export class AccountsConsumer extends React.Component<any, any> {
  public render() {
    const children = this.props.children;
    return (
      <AccountsContext.Consumer>
        {context => {
          // tslint:disable-next-line:max-classes-per-file
          const C = class extends React.Component<any, any> {
            public render() {
              return children;
            }
          };
          return <C />;
        }}
      </AccountsContext.Consumer>
    );
  }
}

export interface AccountsProviderProps {
  accounts: Accounts;
  components: any;
}

const defaultState = {
  view: 'signIn',
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
};

// tslint:disable-next-line:max-classes-per-file
export class AccountsProvider extends React.Component<any, any> {
  public state = defaultState;
  private user: any;
  private labels: {};
  private options: {};
  private components: {};
  private accounts: Accounts;
  private handlers: AccountsHandlers;

  constructor(props: AccountsContext) {
    super(props);

    this.labels = merge(defaultLabels, props.labels);
    this.options = merge(defaultOptions, props.options);
    this.components = merge(defaultComponents, props.components);
    this.accounts = this.props.accounts;
    this.handlers = {
      handleChangeState: this.handleChangeState.bind(this),
      handleSignInClicked: this.handleSignInClicked.bind(this),
      handleClearErrors: this.handleClearErrors.bind(this),
      handleResetForm: this.handleResetForm.bind(this),
    };
    this.user = null;
  }

  public componentDidUpdate(prevProps, nextProps) {
    // console.log(nextProps);
  }

  public async componentDidMount() {
    // const { client, options } = this.props;
    // const serverOptions = await client.getAccountsOptions();
    // this.props.serverOptionsLoaded(true);
    // this.props.setOptions(merge(serverOptions, options));
  }

  public handleChangeState(path, value) {
    return this.setState(set(this.state, path, value));
  }

  public handleClearErrors(form) {
    return this.handleChangeState(form, {
      error: null,
      fields: Object.keys(this.state[form].fields).reduce((res, curr) => {
        return {
          ...res,
          [curr]: {
            error: null,
          },
        };
      }, {}),
    });
  }

  public handleResetForm(form) {
    return this.handleChangeState(form, defaultState[form]);
  }

  public async handleSignInClicked() {
    // await this.handleClearErrors('signIn');

    const signIn = this.state.signIn;

    const client = this.accounts.client;

    const email =
      !isEmpty(trim(signIn.fields.user.value)) &&
      isEmail(signIn.fields.user.value) &&
      signIn.fields.user.value;

    const username = signIn.fields.user.value;

    if (isEmpty(trim(username)) && !email) {
      this.handleChangeState('signIn.fields.user', {
        error: 'Username or email is required',
      });
      return;
    }

    const password = this.state.signIn.fields.password.value;

    if (isEmpty(trim(password))) {
      this.handleChangeState('signIn.fields.password', {
        error: 'Password is required',
      });
      return;
    }

    client
      .loginWithService('password', {
        user: {
          email,
          username,
        },
        password,
      })
      .then(() => {
        return client.getUser();
      })
      .then(user => {
        this.user = user;
        this.handleResetForm('signIn');
        return this.handleChangeState('user', user);
      })
      .catch(error => {
        this.handleChangeState('signIn.error', formatError(error.message));
      });
  }

  public render() {
    return (
      <AccountsContext.Provider
        value={{
          accounts: this.accounts,
          state: this.state,
          labels: this.labels,
          options: this.options,
          components: this.components,
          handlers: this.handlers,
          user: this.user,
        }}
      >
        {this.props.children}
      </AccountsContext.Provider>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Accounts extends React.Component<any, any> {
  public render() {
    return (
      <AccountsConsumer>
        {context => (
          <context.components.Wrapper>
            {context.state.view === 'signIn' && (
              <context.components.SignIn.Form>
                <context.components.SignIn.Fields>
                  <context.components.SignIn.UserField
                    handleChange={e =>
                      context.handlers.handleChangeState(`signIn.fields.user.value`, e.target.value)
                    }
                    error={context.state.signIn.fields.user.error}
                  />
                  <context.components.SignIn.PasswordField
                    handleChange={e =>
                      context.handlers.handleChangeState(
                        `signIn.fields.password.value`,
                        e.target.value
                      )
                    }
                    error={context.state.signIn.fields.password.error}
                  />
                </context.components.SignIn.Fields>
                <context.components.Error error={context.state.signIn.error} />
                <context.components.SignIn.Actions>
                  <context.components.SignIn.SignUpButton
                    onClick={() => context.handlers.handleChangeState('view', 'signIn')}
                  />
                  <context.components.SignIn.SignInButton
                    onClick={context.handlers.handleSignInClicked}
                  />
                </context.components.SignIn.Actions>
              </context.components.SignIn.Form>
            )}
            {context.state.view === 'signUp' && (
              <context.components.SignUp.Form>
                <context.components.SignUp.Fields>
                  <context.components.SignUp.UserField
                    handleChange={e =>
                      context.handlers.handleChangeState(`signUp.fields.user.value`, e.target.value)
                    }
                    error={context.state.signUp.fields.user.error}
                  />
                  <context.components.SignUp.PasswordField
                    handleChange={e =>
                      context.handlers.handleChangeState(
                        `signUp.fields.password.value`,
                        e.target.value
                      )
                    }
                    error={context.state.signUp.fields.password.error}
                  />
                </context.components.SignUp.Fields>
                <context.components.Error error={context.state.signIn.error} />
                <context.components.SignUp.Actions>
                  <context.components.SignUp.SignInButton
                    onClick={() => context.handlers.handleChangeState('view', 'signIn')}
                  />
                  <context.components.SignUp.SignUpButton />
                </context.components.SignUp.Actions>
              </context.components.SignUp.Form>
            )}
          </context.components.Wrapper>
        )}
      </AccountsConsumer>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Auth extends React.Component<any, any> {
  public render() {
    return (
      <AccountsConsumer>
        {(context: AccountsContext) => {
          console.log(context);
          if (get(context, 'state.user')) {
            return isFunction(this.props.children)
              ? this.props.children(context)
              : this.props.children;
          }
        }}
      </AccountsConsumer>
    );
  }
}
