import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import { AccountsServer, ServerHooks } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import accountsExpress, { userLoader } from '@accounts/rest-express';
import MongoDBInterface from '@accounts/mongo';
import { AuthenticatorOtp } from '@accounts/authenticator-otp';

mongoose.connect('mongodb://localhost:27017/accounts-js-rest-example', { useNewUrlParser: true });
const db = mongoose.connection;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const accountsPassword = new AccountsPassword({
  // This option is called when a new user create an account
  // Inside we can apply our logic to validate the user fields
  validateNewUser: user => {
    // For example we can allow only some kind of emails
    if (user.email.endsWith('.xyz')) {
      throw new Error('Invalid email');
    }
    return user;
  },
});

const accountsServer = new AccountsServer(
  {
    db: new MongoDBInterface(db),
    tokenSecret: 'secret',
  },
  {
    password: accountsPassword,
  },
  {
    otp: new AuthenticatorOtp({}),
  }
);

accountsServer.on(ServerHooks.ValidateLogin, ({ user }) => {
  // This hook is called every time a user try to login.
  // You can use it to only allow users with verified email to login.
  // If you throw an error here it will be returned to the client.
});

app.use(accountsExpress(accountsServer));

app.get('/user', userLoader(accountsServer), (req, res) => {
  res.json({ user: (req as any).user });
});

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
