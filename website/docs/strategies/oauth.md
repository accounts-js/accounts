---
id: oauth
title: OAuth
sidebar_label: OAuth
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/oauth) |
[npm](https://www.npmjs.com/package/@accounts/oauth)

The `@accounts/oauth` package provides a secure system for a OAuth based login strategy.

## Install

```
# With yarn
yarn add @accounts/oauth

# Or if you use npm
npm install @accounts/oauth --save
```

## Usage

This example is written in Typescript - remove any type definitons if you are using plain JS.

```javascript
import { AccountsServer } from '@accounts/server';
import { AccountsOauth } from '@accounts/oauth';

// We create a new OAuth instance (with at least one provider)
const accountsOauth = new AccountsOauth({
  // ... OAuth providers
});

// We pass the OAuth instance the AccountsServer service list
const accountsServer = new AccountsServer(...config, {
  oauth: accountsOauth,
});
```

## Setting up a provider

In this example we are going to use **[Nextcloud](https://docs.nextcloud.com/server/19/admin_manual/configuration_server/oauth2.html)** as an OAuth [OpenID Connect](https://en.wikipedia.org/wiki/OpenID_Connect) Authorization Server, but it works the same way with any other provider.

There's an example repo for **Google OAuth** (React-based): [here](https://github.com/accounts-js/accounts/pull/961)

### Register your app as OAuth client with the provider

For Nextcloud, read [their docs](https://docs.nextcloud.com/server/19/admin_manual/configuration_server/oauth2.html) to set up your app as an OAuth Client. You'll need the details in the next step.

### Create the Login dialog UI

In the appropriate place of your app, place an "Authenticate via Nextcloud" button that will open a popup window for the user to authenticate via the OAuth provider.

When receiving this code, the client will send it to the AccountsJS-based server, which will verify it with the provider (Nextcloud) itself (we will define the serverside part later).

```typescript
import qs from 'qs' // https://www.npmjs.com/package/qs

function startNextcloudLogin () {
  //ui.loginLoading = true
  console.log(process.env)
  const config = {
    nextcloudOAuthURL: 'https://your-nextcloud.org/apps/oauth2/authorize'
    clientID: '...' // The ID of the client you registered with the provider
    redirectURL: 'http://localhost:8080/oauth-callback/nextcloud' // arbitrary URL in your app that you need to register a handler for (shown in a later step)
  }

  const params = {
    response_type: 'code',
    client_id: config.clientID as string,
    redirect_uri: config.redirectURL as string,
    // (put here any extra params needed - e.g. for google: 'scope')
  }

  // Create a BroadcastChannel for the popup window to return the auth code
  // see: https://mdn.io/BroadcastChannel
  const oauthLoginChannel = new BroadcastChannel('oauthLoginChannel')
  oauthLoginChannel.onmessage = async e => {
    const code = e.data as string
    try {
      // Send this code to the AccountsJS-based server
      await accountsClient.loginWithService('oauth', { provider: 'nextcloud', code })
      // the 'provider' is key you specify in AccountsOauth config
      console.log('User in LoginDialog success', user)
      user.value = await accountsClient.getUser()
      //ui.loginSuccess()
    } catch (e) {
      console.error('Failed to authenticate with received token', code, e)
      //ui.error = (e as Error).message
    }
    //ui.loginLoading = false
  }

  // Open popup window with OAuth provider page
  const width = 600, height = 600
  const left = window.innerWidth / 2 - width / 2
  const top = window.innerHeight / 2 - height / 2
  window.open(
    `${config.nextcloudOAuthURL}?${qs.stringify(params)}`,
    '',
    `toolbar=no, location=no, directories=no, status=no, menubar=no,
    scrollbars=no, resizable=no, copyhistory=no, width=${width},
    height=${height}, top=${top}, left=${left}`,
  )
}
```

### Create a handler for callback URI

The OAuth provider will redirect to the specified `redirectUri` with a query string appended `?code=...` - as we're still inside the popup window, the handler we define below will take that code and send it via the BroadcastChannel (created when opening the popup window) back to the main window.

The handler `oauthLoginChannel.onmessage` will use that code to authenticate against your app's accountsjs-based server.

Register a route with your router. Example with vue-router:

```typescript
{ path: '/oauth-callback/:service', component: () => import('components/auth/OAuthCallback.vue') }
```

Define the handler (example based on vue-router):

```typescript
import qs from 'qs';

export default defineComponent({
  setup() {
    const { route } = useRouter();

    const service = route.value.params.service;
    console.log('service:', service);

    onMounted(() => {
      const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true });

      const loginChannel = new BroadcastChannel('oauthLoginChannel');
      loginChannel.postMessage(queryParams.code); // send the code
      loginChannel.close();
      window.close();
    });

    return { ...toRefs(data), service };
  },
});
```

### Create the provider definition

In the `oauthLoginChannel.onmessage` handler, we called:

```typescript
accountsClient.loginWithService('oauth', { provider: 'nextcloud', code });
```

AccountsJS client will send that code to the server, where define a provider:

```typescript
const accountsOauth = new AccountsOauth({
  nextcloud: new AccountsNextcloudProvider(),
});
```

The provider is defined like this:

```typescript
export class AccountsNextcloudProvider implements OAuthProvider {
  /* This method is called when the user returns from the provider with an authorization code */
  async authenticate(params: any): Promise<OAuthUser> {
    // params.code is the auth code that nextcloud OAuth provides to the client
    // then LoginDialog sends the code here via accountsClient.loginWithService
    // it is used here to authenticate against nextcloud and to get the user info

    // Ask Nextcloud server if the code is valid, and which user it authenticates
    const response = await axios.post(
      config.get('accounts.oauth.nextcloud.token-endpoint'), // see: https://docs.nextcloud.com/server/19/admin_manual/configuration_server/oauth2.html
      qs.stringify({
        grant_type: 'authorization_code',
        code: params.code,
        client_id: config.get('accounts.oauth.nextcloud.id'), // must be the one that the frontend used to authenticate
        client_secret: config.get('accounts.oauth.nextcloud.secret'), // The provider defines this when you register your app as an OAuth client
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const data = response.data;
    const token: string = data.access_token;
    const userID: string = data.user_id;

    // Optional - query Nextcloud for additional user info:

    // const userinfoEndpoint: string = config.get('accounts.oauth.nextcloud.userinfo-endpoint')
    // const userProfileRes = await axios.get(
    //   `${userinfoEndpoint}${userID}`,
    //   {
    //     headers: {
    //       'OCS-APIRequest': true, // https://github.com/nextcloud/server/issues/2753#issuecomment-267959121
    //       Authorization: `Bearer ${token}`,
    //       Accept: 'application/json',
    //     },
    //   },
    // )
    // const userMeta: Object = userProfileRes.data.ocs.data
    // const groups = _.get(userMeta, 'groups', [])
    // const isAdmin = !!groups.includes('admin')

    // This data will be passed to the getRegistrationPayload below, and to createJwtPayload (see optional step later)
    return {
      id: userID,
      //data: userMeta, isAdmin, groups,
    };
  }

  /* If your server doesn't know the user yet, this method will be called to get initial user info to be stored in the DB */
  async getRegistrationPayload(oauthUser: OAuthUser): Promise<any> {
    console.log('OAuth Registration payload for:', oauthUser);
    return {
      // This is nextcloud-specific - TODO: Adapt to your provider
      // username: oauthUser.data.id,
      // email: oauthUser.data.email,
      // displayName: oauthUser.data.displayname,
    };
  }
}
```

### Try it out :)

This should be enough for a basic OAuth setup to work.

## Optional: Extend the JWT token

In order to add custom fields to the JWT you need to pass a validateNewUser function when you instantiate the `@accounts/password` package.

```javascript
new AccountsServer<ExtendedUserType>(
    {
      createJwtPayload: async (data, user) => {
        // data is the object returned from AccountsNextcloudProvider.authenticate
        // user is the user fetched from the db

        const nextcloudData = _.get(user.services, 'nextcloud')
        if (!nextcloudData) {
          console.log('Extending JWT skipped - no Nextcloud data') // seems to be called sometimes without the data
          return
        }

        // return additional data for the JWT payload
        return {
          isAdmin: nextcloudData.isAdmin,
          groups: nextcloudData.groups,
        }
      },
      //... other server options
    },
    //... services config
  )
```
