---
title: Code
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/code) |
[npm](https://www.npmjs.com/package/@accounts/code)

The `@accounts/code` package provide a secure system for a code based login strategy. The code is being created prior to the login request and sent to the client via a provider (SMS provider for example)

## Install

```
# With yarn
yarn add @accounts/code

# Or if you use npm
npm install @accounts/code --save
```

A provider is also needed. You can use `accounts` providers or create your own.

## Usage

```javascript
import AccountsServer from '@accounts/server';
import AccountsCode from '@accounts/code';

// We create a new code instance with a code provider and extra configuration
const accountsCode = new AccountsCode(provider, ...config);

// We pass the code instance the AccountsServer service list
const accountsServer = new AccountsServer(...config, {
  code: accountsCode,
});
```

## Providers

### twilio

#### Install

```
# With yarn
yarn add @accounts/code-provider-twilio

# Or if you use npm
npm install @accounts/code-provider-twilio --save
```

#### Usage

```js
import { AccountsServer } from '@accounts/server';
import { AccountsCode } from '@accounts/code';
import { CodeProviderTwilio } from '@accounts/code-provider-twilio';

const codeProvider = new CodeProviderTwilio({
  sid: 'TWILIO_SID',
  secret: 'TWILIO_SECRET',
  phoneNumber: 'TWILIO_FROM_PHONE_NUMBER',
});

export const accountsCode = new AccountsCode({
  codeProvider,
  // options
});

const accountsServer = new AccountsServer(
  {
    // options
  },
  {
    code: accountsCode,
  }
);
```

## Create a custom provider

In order to create a custom code provider you need to implement the `CodeProvider` interface from `@accounts/code`.
