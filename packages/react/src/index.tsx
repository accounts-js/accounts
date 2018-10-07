import React from 'react';
import PropTypes from 'prop-types';

import { compose, withStateHandlers, lifecycle, branch, renderNothing } from 'recompose';

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
  accountsOptions,
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
          options: accountsOptions,
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
      accountsOptions: props.accountsOptions,
    }),
    {
      handleChangeView: () => view => ({
        view,
      }),
      setAccountsOptions: () => accountsOptions => ({
        accountsOptions,
      }),
    }
  ),
  branch(
    props => !props.accountsOptions,
    lifecycle({
      async componentDidMount() {
        const { accountsClient, setAccountsOptions } = this.props;
        const accountsOptions = await accountsClient.getAccountsOptions();
        setAccountsOptions(accountsOptions);
      },
    })
  ),
  branch(props => !props.accountsOptions, renderNothing)
)(AccountsProvider);

export { AccountsProvider };

export const AccountsConsumer = AccountsContext.Consumer;

export const Accounts: React.SFC<any> = () => (
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

Accounts.propTypes = {
  title: PropTypes.string,
};
