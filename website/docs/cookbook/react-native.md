---
id: react-native
title: react-native
sidebar_label: react-native
---

By default accounts-js use the `localStorage` api to store the tokens.

Since react-native does not have `localStorage`, we can use the [React Native Async Storage](https://github.com/react-native-community/async-storage).

To setup the client to use the AsyncStorage api you need to apply the following configuration:

```javascript
import AsyncStorage from '@react-native-community/async-storage';
import { AccountsClient } from '@accounts/client';

const accounts = new AccountsClient({
  // We tell the accounts-js client to use AsyncStorage to store the tokens
  tokenStorage: AsyncStorage,
});
```
