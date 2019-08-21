# @accounts/code-provider-sms

## Install

```
yarn add @accounts/code-provider-sms
```

## Usage

```js
import { AccountsServer } from '@accounts/server';
import { AccountsCode } from '@accounts/code';
import { CodeProviderSMS } from '@accounts/code-provider-sms';

const codeProvider = new CodeProviderSMS({
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
