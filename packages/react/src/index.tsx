import React from 'react';
import { compose, withStateHandlers } from 'recompose';

const AccountsContext = React.createContext('accounts');

const defaultLabels = {
  login: {
    username: 'Username',
    password: 'Password',
    login: 'Login',
    signup: 'Signup',
  },
  signup: {
    username: 'Username',
    password: 'Password',
    signup: 'Signup',
    loginInstead: 'Login instead',
  },
};

const defaultComponents = {
  Wrapper: ({ children }) => children,
};

let AccountsProvider: React.SFC<any> = ({
  children,
  accountsClient,
  accountsPassword,
  accountsLabels = {},
  accountsComponents,
  view,
  handleChangeView,
}) => {
  const labels = { ...defaultLabels, ...accountsLabels };
  const components = { ...defaultComponents, ...accountsComponents };

  return (
    <AccountsContext.Provider
      value={
        {
          accountsClient,
          accountsPassword,
          components,
          labels,
          view,
          handleChangeView,
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
      view: props.view || 'login',
    }),
    {
      handleChangeView: () => view => ({
        view,
      }),
    }
  )
)(AccountsProvider);

export { AccountsProvider };

export const AccountsConsumer = AccountsContext.Consumer;

export const Accounts = () => (
  <AccountsConsumer>
    {({ view, components }) => {
      return (
        <components.Wrapper>
          {view === 'login' && <components.login.LoginForm />}
          {view === 'signup' && <components.signup.SignupForm />}
        </components.Wrapper>
      );
    }}
  </AccountsConsumer>
);
