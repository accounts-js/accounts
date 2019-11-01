# @accounts/code-provider-twilio

## Install

```
yarn add @accounts/code-provider-twilio
```

## Usage

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
