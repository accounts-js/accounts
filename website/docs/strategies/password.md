---
id: password
title: Password
sidebar_label: Server
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/password) |
[npm](https://www.npmjs.com/package/@accounts/password)

The `@accounts/password` package provide a secure system for a password based login strategy.
This package will let you build your custom email (and or username) / password strategy.

## Install

```
# With yarn
yarn add @accounts/password

# Or if you use npm
npm install @accounts/password --save
```

## Usage

```javascript
import AccountsServer from '@accounts/server';
import AccountsPassword from '@accounts/password';

// We create a new password instance with some custom config
const accountsPassword = new AccountsPassword(...config);

// We pass the password instance the AccountsServer service list
const accountsServer = new AccountsServer(...config, {
  password: accountsPassword,
});
```

### Examples

To see how to integrate the package into your app you can check these examples:

- [GraphQL Server](https://github.com/accounts-js/accounts/tree/master/examples/graphql-server-typescript)
- [Express REST Server](https://github.com/accounts-js/accounts/tree/master/examples/rest-express-typescript)

### Extend the user and validate custom fields

By default accounts-js only allow `username`, `email` and `password` for the user. In order to add custom fields you need to pass the validateNewUser function when you instantiate the `@accounts/password` package.

```javascript
import AccountsPassword from '@accounts/password';

const accountsPassword = new AccountsPassword({
  // This option is called when a new user create an account
  // The user returned will be inserted into the database
  // For example here we allow a new `firstName` field on the user object
  validateNewUser: async user => {
    // You can apply some custom validation
    if (!user.firstName) {
      throw new Error('First name is required');
    }
    if (user.firstName.length < 3) {
      throw new Error('First name too short');
    }

    // We specify all the fields that can be inserted in the database
    return pick(user, ['username', 'email', 'password', 'firstName']);
  },
});
```

### Multiple emails

You might want to allow multiple emails in your app, we allow this behavior by allowing you to link multiple emails to the user. **Use the following functions instead of directly updating the database**:

- `AccountsPassword.addEmail` - Add an email address for a user.
- `AccountsPassword.removeEmail` - Remove an email address for a user.
- `AccountsPassword.verifyEmail` - Marks the user's email address as verified.

### Email case sensitivity

Due to some databases limitations, we have to do some internal logic to ensure that emails and usernames are uniques.

⚠️ Never query your database directly when you want to query a user by username or email. Instead use the the `AccountsPassword.findUserByEmail` and `AccountsPassword.findUserByUsername` functions.

## Two factor

The password module come with two factor out of the box. You can customize it using the `twoFactor` option.
Check all the options available [here](/docs/api/two-factor/api-interfaces-accountstwofactoroptions).

```javascript
export const accountsPassword = new AccountsPassword({
  twoFactor: {
    // Will be the two factor name displayed to the user
    appName: 'My app',
  },
});
```
