import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
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

const accountsServer = new AccountsServer(
  {
    db: new MongoDBInterface(db),
    tokenSecret: 'secret',
  },
  {
    password: new AccountsPassword(),
  }
);
app.use(accountsExpress(accountsServer));

app.get('/user', userLoader(accountsServer), (req, res) => {
  res.json({ user: req.user });
});

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
