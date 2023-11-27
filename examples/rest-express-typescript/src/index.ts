import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { AccountsServer, AuthenticationServicesToken, ServerHooks } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import accountsExpress, { userLoader } from '@accounts/rest-express';
import { createApplication } from 'graphql-modules';
import { createAccountsCoreModule } from '@accounts/module-core';
import { createAccountsPasswordModule } from '@accounts/module-password';
import { createAccountsMongoModule } from '@accounts/module-mongo';

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/accounts-js-rest-example');
const dbConn = mongoose.connection;

const app = createApplication({
  modules: [
    createAccountsCoreModule({ tokenSecret: 'secret' }),
    createAccountsPasswordModule({
      // This option is called when a new user create an account
      // Inside we can apply our logic to validate the user fields
      validateNewUser: (user) => {
        if (!user.firstName) {
          throw new Error('First name required');
        }
        if (!user.lastName) {
          throw new Error('Last name required');
        }

        // For example we can allow only some kind of emails
        if (user.email.endsWith('.xyz')) {
          throw new Error('Invalid email');
        }
        return user;
      },
    }),
    createAccountsMongoModule({ dbConn }),
  ],
  providers: [
    {
      provide: AuthenticationServicesToken,
      useValue: { password: AccountsPassword },
      global: true,
    },
  ],
});

const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(cors());

interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
}

const User = mongoose.model<UserDoc>(
  'User',
  new mongoose.Schema({ firstName: String, lastName: String })
);

const controller = app.createOperationController({
  context: {},
});
const accountsServer = controller.injector.get(AccountsServer);
expressApp.use(accountsExpress(accountsServer));

accountsServer.on(ServerHooks.ValidateLogin, ({ user }) => {
  // This hook is called every time a user try to login.
  // You can use it to only allow users with verified email to login.
  // If you throw an error here it will be returned to the client.
  console.log('Logged in', user);
});

/**
 * Load and expose the accounts-js middleware
 */
expressApp.use(accountsExpress(accountsServer));

/**
 * Return the current logged in user
 */
expressApp.get('/user', userLoader(accountsServer), (req, res) => {
  res.json({ user: (req as any).user });
});

/**
 * Expose a public route to edit user informations
 * - route is protected
 * - update the current logged in user in the db
 */
expressApp.put('/user', userLoader(accountsServer), async (req, res) => {
  const userId = (req as any).userId;
  if (!userId) {
    res.status(401);
    res.json({ message: 'Unauthorized' });
    return;
  }
  const user = await User.findById(userId).exec();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  await user.save();
  res.json(true);
});

expressApp.listen(process.env.PORT || 4000, () => {
  console.log('Server listening on port 4000');
});
