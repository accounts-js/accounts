---
id: otp
title: One-Time Password
sidebar_label: OTP
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/factor-otp) |
[npm](https://www.npmjs.com/package/@accounts/factor-otp)

The `@accounts/factor-otp` package provide a secure way to use OTP as a multi factor authentication step.
This package will give the ability to your users to link an authenticator app (eg: Google Authenticator) to secure their account.

> In order to generate and verify the validity of the OTP codes we are using the [otplib](https://github.com/yeojz/otplib) npm package

# Server configuration

The first step is to setup the server configuration.

## Installation

```
# With yarn
yarn add @accounts/factor-otp
# Or if you use npm
npm install @accounts/factor-otp --save
```

## Usage

```javascript
import AccountsServer from '@accounts/server';
import { FactorOtp } from '@accounts/factor-otp';

// We create a new password instance with some custom config
const factorOtp = new FactorOtp(...config);

// We pass the password instance the AccountsServer service list
const accountsServer = new AccountsServer(
  ...config,
  {
    // Your services
  },
  {
    // List of MFA factors
    otp: factorOtp,
  }
);
```

## Options

```typescript
interface FactorOtpOptions {
  /**
   * Tokens in the previous and future x-windows that should be considered valid.
   */
  window?: number;
}
```

## Examples

To see how to integrate the package into your app you can check these examples:

- [GraphQL Server](https://github.com/accounts-js/accounts/tree/master/examples/graphql-server-typescript)
- [Express REST Server](https://github.com/accounts-js/accounts/tree/master/examples/rest-express-typescript)

# Client configuration

In order to follow this process you will need to have `AccountsClient` already setup (it will be referred as `accountsClient` variable).

## Start the association

First step will be to request a new association for the device. To do so, we have to call the `mfaAssociate` client function.

```typescript
// This will trigger a request on the server
const data = await accountsClient.mfaAssociate('otp');
// Data have the following structure
{
  // Token that will be used later to activate the new authenticator
  mfaToken: string;
  // Id of the object stored in the database
  id: string;
  // Secret to show to the user so they can save it in a safe place
  secret: string;
}
```

## Displaying a QR code to the user

Second step will be to display a QR code that can be scanned by a user so it will be added easily to his authenticator app.

- If you are using plain js you can do the following:

```javascript
import qrcode from 'qrcode';

const data = await accountsClient.mfaAssociate('otp');

// Format a valid uri string for the authenticator app.
// You can customise it with the user email for example, you can also change the issue.
const otpauthUri = `otpauth://totp/accounts-js:${user.email}?secret=${data.secret}&issuer=accounts-js`;

qrcode.toDataURL(otpauthUri, (err, imageUrl) => {
  if (err) {
    console.log('Error with QR');
    return;
  }
  // You can now display the imageUrl to the user so he can scan it with his authenticator app
  console.log(imageUrl);
});
```

- If you are using react you can do the following:

```javascript
import QRCode from 'qrcode.react';

const data = await accountsClient.mfaAssociate('otp');

// Format a valid uri string for the authenticator app.
// You can customise it with the user email for example, you can also change the issue.
const otpauthUri = `otpauth://totp/accounts-js:${user.email}?secret=${data.secret}&issuer=accounts-js`;

// In your render function
<QRCode value={otpauthUri} />;
```

## Confirm the association

Finally, in order to activate the new authenticator, we need to validate the OTP code.
You will need to login using the `mfa` service by using the code you collected from the user coming from his authenticator app.

```javascript
// oneTimeCode is the OTP code entered by the user
const oneTimeCode = '...';

await accountsRest.loginWithService('mfa', {
  mfaToken: secret.mfaToken,
  code: oneTimeCode,
});
```

If the call was successful, the authenticator is now activated and will be required next time the user try to login.

## Examples

To see how to integrate the package into your app you can check these examples:

- [React GraphQL](https://github.com/accounts-js/accounts/tree/master/examples/react-graphql-typescript)
- [React REST](https://github.com/accounts-js/accounts/tree/master/examples/react-rest-typescript)
