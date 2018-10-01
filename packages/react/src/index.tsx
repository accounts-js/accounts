import React from 'react';
import { compose, withStateHandlers } from 'recompose';

const AccountsContext = React.createContext('accounts');

const defaultLabels = {
  username: 'Username',
  password: 'Password',
  login: 'Login',
  signup: 'Signup',
};

let AccountsProvider: React.SFC<any> = ({
  children,
  accountsClient,
  accountsPassword,
  accountsLabels = {},
  view,
  handleChangeView,
}) => {
  const labels = { ...defaultLabels, ...accountsLabels };

  return (
    <AccountsContext.Provider
      value={
        {
          accountsClient,
          accountsPassword,
          accountsLabels: labels,
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
