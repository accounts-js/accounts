---
id: handling-errors
title: Handling errors
sidebar_label: 'Handling errors'
---

In order to have descriptive error messages and codes on the server we use a generic error named `AccountsJsError`. This error provide a `message` property containing a descriptive error message (eg: "Email already exists"). It also provides a `code` property that is reflecting a constant value to the error (eg: `EmailAlreadyExists`).

Every public server function is exporting a custom enum describing all the possible errors.

You can catch errors and do some custom logic based on the error like this:

```ts
import { AccountsJsError } from '@accounts/server';
import { CreateUserErrors } from '@accounts/password';

try {
  await accountsPassword.createUser({
    // ...
  });
} catch (error) {
  if (error instanceof AccountsJsError) {
    // You can access the error message via `error.message`
    // Eg: "Email already exists"
    // You can access the code via `error.code`
    // Eg:
    if (error.code === CreateUserErrors.EmailAlreadyExists) {
      // do some custom logic
    }
  } else {
    // Else means it's an internal server error so you probably want to obfuscate it and return
    // a generic "Internal server error" to the user.
  }
}
```
