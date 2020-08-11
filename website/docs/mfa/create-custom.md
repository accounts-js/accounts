---
id: create-custom
title: Creating a custom factor
sidebar_label: Creating a custom factor
---

One of the features of accounts-js it's his modular architecture. This allow you to easily create your custom factors if the lib not provide the one you are looking for.

_Since accounts-js is written in typescript, in this guide we will also assume that your factor is written in typescript. But the same logic can be applied to javascript._

## Default template

All you need to do is to create a new file in your project (eg: `my-custom-factor.ts`) and then copy paste the following template:

```ts
import { DatabaseInterface, AuthenticatorService, Authenticator } from '@accounts/types';
import { AccountsServer } from '@accounts/server';

interface DbAuthenticatorMyCustomFactor extends Authenticator {}

export class AuthenticatorMyCustomFactor implements AuthenticatorService {
  public serviceName = 'my-custom-factor';

  public server!: AccountsServer;

  private options: AuthenticatorOtpOptions & typeof defaultOptions;
  private db!: DatabaseInterface;

  public setStore(store: DatabaseInterface) {
    this.db = store;
  }

  public async associate(userId: string, params: any): Promise<any> {
    // This method is called when a user start the association of a new factor.
  }

  public async authenticate(authenticator: DbAuthenticatorOtp, params: any): Promise<boolean> {
    // This method is called when we need to resolve the challenge for the user.
    // eg: when a user login or is trying to finish the association of an authenticator.
  }

  public sanitize(authenticator: DbAuthenticatorMyCustomFactor): Authenticator {
    // This methods is called every time a user query for the authenticators linked to his account.
  }
}
```

Add your custom logic and then link it to your accounts-js server.

For best practices and inspiration you should check the source code of the official factors we provide:

- [One-Time Password](https://github.com/accounts-js/accounts/tree/master/packages/factor-otp)
