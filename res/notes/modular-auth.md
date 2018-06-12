## Modular Auth notes

- Authentication service

  - Each service will have it's own repository to hold implementation

  - Things to consider

    - ui
      - Forms or any view component should be defined for each component.
      - Idealy accounts/client will passed on the ui config method and it will then be used by the ui components
    - data store
      - Store auth details for document based stores
        - How indexes are handled?
      - map to relational entries (for sql implmentation)
    - added endpoints
      - should expose the express/koa/hapi middleware if needed.

  - Register service plugins

    - Register on client
    - Register on server
    - Suggested API


    ```typescript
    // client code
    const accountsClient = new AccountsClient({
      authServices: {
        local: PasswordService,
        google: GoogleOAuth,
        sso: CustomSSO,
        ...moreAuthServices,
      },
    });

    // server code
    const accountsClient = new AccountsClient({
      authServices: {
        local: PasswordService,
        google: GoogleOAuth,
        sso: CustomSSO,
        ...moreAuthServices,
      },
    });
    ```

- Auth details (Password, Token, Face, Fingerprint, DeviceID, OAuth2)

  - Authenticate details
  - Register auth details for user
  - Recover/Override details
    - It seems as though the only strategy that requiers this kind of logic will be a local strtegy

- Authenticate detail suggested API

```typescript
login(serviceName: string, authDetails: Object): Promise<SessionToken>
```

- Register auth details suggested API (Some strategies will only allow that on the server)

```typescript
register(serviceName: string, authDetails: Object): Promise<UserObject>
```

In order to spot potential abstractions on the different authentication strategies I've tried to breakdown the flows in my own words. It might be helpful for someone.

### Local strategy (Password / Fingerprint / Pattern)

- Before authorization the client knows nothing and it shows the usraer a form or some kind of input mechanism that allows
  the user to write his identity (Phone / Username / Email) and an authorization information (Password / Fingerprint / Pattern)

- After the user inserts his auth detail accounts/client will send a request of `login` to the accounts/server

- accounts/server will then validate the user details and send back the SessionToken object.

### OAuth2 breakdown (Used this [helpfull resource](https://alexbilbie.com/guide-to-oauth-2-grants/) by Alex Bilbie)

- Before authentication client app needs to know

  - `client_id` (You get this when you register the your app and could be hardcoded in the client code)
  - authorization url (Like google oauth endpoint)
  - `scope` (access to what resources)

- When the user clicks authenticate button he is redirected to the autorization url.

- The request has the following query params:

  - `response_type` that has the constant value `code`
  - `client_id` explaind above
  - `scope` explained above
  - Optional - `redirect_url` overrides the url provided with registration of the app
  - Optional - `state` CSRF token to validate when the user is redirected back

- On the other site (e.g. google login form) the user is identified by any form and then
  gets redirected back to the client site with the authorization `code` and `state`.

- The `redirect_url` would then be handled by:

  - accounts/client
    - When redirected back to the app it will use accounts/client to transfer authorization `code` to the server using any transport.
  - accounts/server
    - Should offer a method to pass in the authorization `code` and move to the next step of the OAuth flow.

> Handling this as a separate rest endpoint where the server gets the properties only and the client is not a part of the porcess, means that transports like `graphql` or `ws` will be rendered useless for this part, and so I think we may need to expose a helper method and let the app developers decide what he would like to do with it. In cases where they will not use our accounts/client they can then use our `rest-express` transport or even create their own endpoint or means of calling this method.

- accounts/server now needs to trade the authorization `code` for a token that will be used for any resource request.
- The trade request is made from the server to the authorization server (e.g. google) using POST and icludes the following fields:

  - `grant_type` that has a constant value of `authorization_code`
  - `client_id` same as before
  - `client_secret` (this is a secret string that is issued together with the `client_id` but should remain on your server)
  - `redirect_uri` The same url that the client was redirected to
  - `code` authorization code the server just got

- The server will get in response the following fields:

  - `token_type` Some kind of constant that represents the type of the token and how it should be used. Most times it will be `Bearer`
  - `expires_in` A numeric value that states the expiration time of the token in seconds
  - `access_token` The token itself
  - `refresh_token` A token that alows the server to get a new access token after it is expired

- OAuth2 flow ends here but we still need to create or authenticate the user in our app.

- For creating our session, accounts/server should require data about the user like `email` or `username` and any additional profile inforamtion the developer would like.

- accounts/server will then create a new user record or attach to an existing user with other authorization service configured and attach `access_token` response object as means to re-authenticate or get data at later time if needed.

### Custom SSO

In this flow the app developer will have an external service that does validation using it's own local authorization details.
accounts/server should be able to trust this external service in some way and issue session tokens for clients after the external service has checked the identity.

- The user submits authentication details on an external app

- After authorization he is then redirected with some auth token to our app

- The accounts/client app will then call `login` with the given auth token

- accounts/server will then validate the auth token against the SSO service

- If validated it will return a session token to the client
