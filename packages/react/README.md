# @accounts/react

[![npm](https://img.shields.io/npm/v/@accounts/react.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/react)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/react
```

## Usage

```js
import React from 'react';
import AccountsProvider from '@accounts/react';

const accountsClient = new AccountsClient({

});

const accountsProviderOptions = {

}

const authLink = accountsLink(accountsClient);

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    authLink
  ]),
  cache,
});

const withUser = (Component) => (options) => {
  return compose(
    getContext({
      accountsClient: PropTypes.object,
      accountsOptions: PropTypes.object,
      accountsState: PropTypes.object,
    }),
    lifecycle({
      onComponentWillMount() {
        const tokens = props.accountsClient.refreshSession();
        if (tokens) {
            this.props.setAccountState({
              signedIn: true
            })
        } else {
          this.props.setAccountState({
            signedIn: false
          })
        }
      }
    })
    branch(
      props => props.accountsState.signedIn
      Component,
    )
  )(Component)
}

const SignedInHeader = withUser({})(SignedInHeader);

const App = () =>
  <AccountsProvider client={accountsClient} options={accountsProviderOptions}>
    <SignedInHeader />
    <Router>
      <WithUser>
        <Route path="/profile" component={User} />
      </WithUser>
      <Route path="/" component={Home}/>
      <WithUserRoute path="/settings" component={Home}/>
    </Router>
  </AccountsProvider>
```
