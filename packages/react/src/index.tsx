import React from 'react';
import { compose } from 'recompose';

const AccountsContext = React.createContext('accounts');

export const AccountsProvider: React.SFC<any> = ({
  children,
  accountsClient,
  accountsPassword,
  theme,
}) => (
  <AccountsContext.Provider
    value={{
      accountsClient,
      accountsPassword,
      theme,
    }}
  >
    {children}
  </AccountsContext.Provider>
);

export const AccountsConsumer = AccountsContext.Consumer;

export const Accounts = () => (
  <AccountsConsumer>
    {value => {
      return <div />;
    }}
  </AccountsConsumer>
);
