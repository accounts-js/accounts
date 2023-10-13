---
id: getting-started
title: Getting started
sidebar_label: 'Piecing together'
---

The `@accounts` packages are modular by nature and can be pieced together via [GraphQL Modules](https://the-guild.dev/graphql/modules) (but you can manually instanciate the providers if REST the only thing you care about).

**Install the core module**

```bash
// Npm
npm install --save @accounts/module-core graphql-modules @accounts/server

// Yarn
yarn add @accounts/module-core graphql-modules @accounts/server
```

**Choose your database database driver**

```bash
// Npm
npm install --save @accounts/module-mongo @accounts/mongo

// Yarn
yarn add @accounts/module-mongo @accounts/mongo
```

**Choose your authentication services**

```bash
// Npm
npm install --save @accounts/module-password @accounts/password

// Yarn
yarn add @accounts/module-password @accounts/password
```

To piece everything together let's create an application module using the database and authentication modules of your choice.

**Start the accounts server**

```javascript
import { createAccountsCoreModule, buildSchema } from '@accounts/module-core';
import { createAccountsMongoModule } from '@accounts/module-mongo';
import { createAccountsPasswordModule } from '@accounts/module-password';
import { createApplication } from 'graphql-modules';

import { AuthenticationServicesToken } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

(async () => {
  const myApp = createApplication({
    modules: [
      createAccountsCoreModule({ tokenSecret: 'your secret' }),
      // If you don't provide a dbConn you have to await because MongoClient.connect is asynchronous
      await createAccountsMongoModule(),
      createAccountsPasswordModule(),
    ],
    // Ugly workaround because of current GraphQL Modules limitations
    providers: [
      {
        provide: AuthenticationServicesToken,
        useValue: { password: AccountsPassword },
        global: true,
      },
    ],
    // To apply the auth directive on top of your schema
    // see https://the-guild.dev/graphql/tools/docs/schema-directives
    schemaBuilder: buildSchema(),
  });
})();
```

The resulting application can be used in conjunction with a GraphQL Server like Yoga if that's the transport of your choice

```javascript
import { context } from '@accounts/module-core';

const { createOperationController } = myApp;

const yoga = createYoga({
  plugins: [useGraphQLModules(myApp)],
  // To patch your GraphQL context with Accounts.js fields like authToken/user/etc.
  context: (ctx) => context(ctx, { createOperationController }),
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
```

or even as an Express middleware if you prefer REST

```javascript
import accountsExpress from '@accounts/rest-express';

const { injector } = myApp;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(accountsExpress(injector.get(AccountsServer)));

app.listen(process.env.PORT || 4000, () => {
  console.log('Server listening on port 4000');
});
```

[GraphQL Modules documentation](https://the-guild.dev/graphql/modules/docs/get-started#use-your-application) will get you started with your preferred GraphQL server.

Configuring additional options, such as providing custom connection options for a database or additional parameters based on your chosen packages can be achieved by supplying an options object when creating each GraphQL module (like we did for the `tokenSecret` in the core module).

Out of the box `@accounts/password` is preconfigured to allow users to sign up with usernames or email addresses.

<!-- Add a link to the options type definitions  -->

## Usage as a GraphQL microservice

Based on your requirements it can be advantageous to deploy a single accounts server which is then consumed by multiple apps.

The following examples will show you how to setup a GraphQL server which can be used to authenticate requests via JWT token.

You can merge your existing GraphQL server schema with the remote accounts server schema via schema stitching.

```javascript
const accountsServerUri = 'http://localhost:4003/graphql';

(async () => {
  const myTypeDefs = gql`
    type PrivateType @auth {
      field: String
    }

    extend type Query {
      # Example of how to delegate to another field of the remote schema. Returns the currently logged in user or null.
      me: User
      # Returns the currently logged in userId directly from the context without querying the remote schema.
      myId: ID
      publicField: String
      # You can only query this if you are logged in
      privateField: String @auth
      privateType: PrivateType
      privateFieldWithAuthResolver: String
    }

    extend type Mutation {
      privateMutation: String @auth
      publicMutation: String
    }
  `;

  const myResolvers = {
    Query: {
      me: {
        resolve: (parent, args, context, info) => {
          return delegateToSchema({
            schema: remoteSubschema,
            operation: OperationTypeNode.QUERY,
            fieldName: 'getUser',
            args,
            context,
            info,
          });
        },
      },
      myId: (parent, args, context) => context.userId,
      publicField: () => 'public',
      privateField: () => 'private',
      privateFieldWithAuthResolver: authenticated(() => {
        return 'private';
      }),
      privateType: () => ({
        field: () => 'private',
      }),
    },
    Mutation: {
      privateMutation: () => 'private',
      publicMutation: () => 'public',
    },
  };

  const remoteExecutor: AsyncExecutor = async ({ document, variables, context }) => {
    console.log('context: ', context);
    const query = print(document);
    const fetchResult = await fetch(accountsServerUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Attach the Authorization to requests which are proxied to the remote schema.
        // This step is optional and only required if you want the `getUser` query to return data.
        ...(context?.authToken && { Authorization: `Bearer ${context.authToken}` }),
      },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };

  const remoteSubschema = {
    schema: await schemaFromExecutor(remoteExecutor),
    executor: remoteExecutor,
  };

  const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth');

  const app = createApplication({
    modules: [
      createAccountsCoreModule({
        tokenSecret: 'secret',
        // setting micro to true will instruct accounts-js to only
        // verify access tokens without any additional session logic
        micro: true,
      }),
      createModule({
        id: 'app',
        typeDefs: myTypeDefs,
        resolvers: myResolvers,
      }),
    ],
    providers: [
      {
        provide: AuthenticationServicesToken,
        useValue: {},
        global: true,
      },
    ],
    schemaBuilder: ({ typeDefs, resolvers }) =>
      authDirectiveTransformer(
        stitchSchemas({
          subschemas: [remoteSubschema],
          typeDefs: mergeTypeDefs([typeDefs, authDirectiveTypeDefs]),
          resolvers,
        })
      ),
  });

  const { createOperationController } = app;

  const yoga = createYoga({
    plugins: [useGraphQLModules(app)],
    context: (ctx) => context(ctx, { createOperationController }),
  });

  const server = createServer(yoga);

  server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql');
  });
})();
```
