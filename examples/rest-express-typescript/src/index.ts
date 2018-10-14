import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import { pick } from 'lodash';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import accountsExpress, { userLoader } from '@accounts/rest-express';
import MongoDBInterface from '@accounts/mongo';

mongoose.connect('mongodb://localhost:27017/accounts-js-rest-example');
const db = mongoose.connection;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const accountsPassword = new AccountsPassword({
  validateNewUser: user => {
    if (!user.firstName) {
      throw new Error('First name is required');
    }
    if (!user.lastName) {
      throw new Error('Last name is required');
    }
    return pick(user, ['username', 'email', 'password', 'firstName', 'lastName']);
  },
});

const accountsServer = new AccountsServer(
  {
    db: new MongoDBInterface(db),
    tokenSecret: 'secret',
  },
  {
    password: accountsPassword,
  }
);
app.use(accountsExpress(accountsServer));

app.get('/user', userLoader(accountsServer), (req, res) => {
  res.json({ user: (req as any).user });
});

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
