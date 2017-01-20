import mongodb from 'mongodb';
import Mongo from './index';

let mongo;
let db;
const user = {
  username: 'johndoe',
  email: 'john@doe.com',
  password: 'toto',
  profile: {},
};

function createConnection(cb) {
  const url = 'mongodb://localhost:27017/accounts-mongo-tests';
  mongodb.MongoClient.connect(url, (err, dbArg) => {
    db = dbArg;
    mongo = new Mongo(db);
    cb(err);
  });
}

function dropDatabase(cb) {
  db.dropDatabase((err) => {
    if (err) return cb(err);
    return cb();
  });
}

function closeConnection(cb) {
  dropDatabase((err) => {
    db.close();
    if (err) return cb(err);
    return cb();
  });
}

describe('Mongo', () => {
  beforeAll(createConnection);

  describe('#constructor', () => {
    it('should have default options', () => {
      expect(mongo.options).toBeTruthy();
    });

    it('should overwrite options', () => {
      const mongoTestOptions = new Mongo(db, {
        collectionName: 'users-test',
      });
      expect(mongoTestOptions.options).toBeTruthy();
      expect(mongoTestOptions.options.collectionName).toEqual('users-test');
    });

    it('should throw with an invalid database connection object', () => {
      try {
        new Mongo(); // eslint-disable-line no-new
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('A valid database connection object is required');
      }
    });
  });

  describe('setupIndexes', () => {
    it('should create indexes', async () => {
      await mongo.setupIndexes();
      const ret = await mongo.collection.indexInformation();
      expect(ret).toBeTruthy();
      expect(ret._id_[0]).toEqual(['_id', 1]); // eslint-disable-line no-underscore-dangle
      expect(ret.username_1[0]).toEqual(['username', 1]);
      expect(ret['emails.address_1'][0]).toEqual(['emails.address', 1]);
    });

    afterAll((done) => {
      dropDatabase(done);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const ret = await mongo.createUser(user);
      expect(ret._id).toBeTruthy();
      expect(ret.emails[0].address).toBe(user.email);
      expect(ret.emails[0].verified).toBe(false);
      expect(ret.createdAt).toBeTruthy();
    });

    it('should not set password', async () => {
      const ret = await mongo.createUser({ email: user.email });
      expect(ret._id).toBeTruthy();
      expect(ret.services.password).not.toBeTruthy();
    });

    it('should not set username', async () => {
      const ret = await mongo.createUser({ email: user.email });
      expect(ret._id).toBeTruthy();
      expect(ret.username).not.toBeTruthy();
    });

    it('should not set email', async () => {
      const ret = await mongo.createUser({ username: user.username });
      expect(ret._id).toBeTruthy();
      expect(ret.emails).not.toBeTruthy();
    });

    it('email should be lowercase', async () => {
      const ret = await mongo.createUser({ email: 'JohN@doe.com' });
      expect(ret._id).toBeTruthy();
      expect(ret.emails[0].address).toEqual('john@doe.com');
    });
  });

  describe('findUserById', () => {
    it('should return null for not found user', async () => {
      const ret = await mongo.findUserById('unknowuser');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const retUser = await mongo.createUser(user);
      const ret = await mongo.findUserById(retUser._id);
      expect(ret).toBeTruthy();
    });
  });

  describe('findUserByEmail', () => {
    it('should return null for not found user', async () => {
      const ret = await mongo.findUserByEmail('unknow@user.com');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const ret = await mongo.findUserByEmail(user.email);
      expect(ret).toBeTruthy();
    });

    it('should return user with uppercase email', async () => {
      await mongo.createUser({ email: 'JOHN@DOES.COM' });
      const ret = await mongo.findUserByEmail('JOHN@DOES.COM');
      expect(ret._id).toBeTruthy();
      expect(ret.emails[0].address).toEqual('john@does.com');
    });
  });

  describe('findUserByUsername', () => {
    it('should return null for not found user', async () => {
      const ret = await mongo.findUserByUsername('unknowuser');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const ret = await mongo.findUserByUsername(user.username);
      expect(ret).toBeTruthy();
    });
  });

  describe('findPasswordHash', () => {
    it('should throw if user is not found', async () => {
      try {
        await mongo.findPasswordHash('unknowuser');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should return hash', async () => {
      const retUser = await mongo.createUser(user);
      const ret = await mongo.findPasswordHash(retUser._id);
      expect(ret).toBeTruthy();
      expect(ret).toEqual(retUser.services.password.bcrypt);
    });
  });

  describe('addEmail', () => {
    it('should throw if user is not found', async () => {
      try {
        await mongo.addEmail('unknowuser', 'unknowemail');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should add email', async () => {
      const email = 'johns@doe.com';
      let retUser = await mongo.createUser(user);
      await mongo.addEmail(retUser._id, email, false);
      retUser = await mongo.findUserByEmail(email);
      expect(retUser.emails.length).toEqual(2);
    });

    it('should add lowercase email', async () => {
      const email = 'johnS@doe.com';
      let retUser = await mongo.createUser(user);
      await mongo.addEmail(retUser._id, email, false);
      retUser = await mongo.findUserByEmail(email);
      expect(retUser.emails.length).toEqual(2);
      expect(retUser.emails[1].address).toEqual('johns@doe.com');
    });
  });

  describe('removeEmail', () => {
    it('should throw if user is not found', async () => {
      try {
        await mongo.removeEmail('unknowuser', 'unknowemail');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should remove email', async () => {
      const email = 'johns@doe.com';
      let retUser = await mongo.createUser(user);
      await mongo.addEmail(retUser._id, email, false);
      await mongo.removeEmail(retUser._id, user.email, false);
      retUser = await mongo.findUserById(retUser._id);
      expect(retUser.emails.length).toEqual(1);
      expect(retUser.emails[0].address).toEqual(email);
    });

    it('should remove uppercase email', async () => {
      const email = 'johns@doe.com';
      let retUser = await mongo.createUser(user);
      await mongo.addEmail(retUser._id, email, false);
      await mongo.removeEmail(retUser._id, 'JOHN@doe.com', false);
      retUser = await mongo.findUserById(retUser._id);
      expect(retUser.emails.length).toEqual(1);
      expect(retUser.emails[0].address).toEqual(email);
    });
  });

  describe('setUsername', () => {
    it('should throw if user is not found', async () => {
      try {
        await mongo.setUsername('unknowuser');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should change username', async () => {
      const username = 'johnsdoe';
      let retUser = await mongo.createUser(user);
      await mongo.setUsername(retUser._id, username);
      retUser = await mongo.findUserById(retUser._id);
      expect(retUser.username).toEqual(username);
    });
  });

  describe('setPasssword', () => {
    it('should throw if user is not found', async () => {
      try {
        await mongo.setPasssword('unknowuser', 'toto');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should change password', async () => {
      const newPassword = 'newpass';
      let retUser = await mongo.createUser(user);
      await mongo.setPasssword(retUser._id, newPassword);
      retUser = await mongo.findUserById(retUser._id);
      expect(retUser.services.password.bcrypt).toBeTruthy();
      expect(retUser.services.password.bcrypt).not.toEqual(newPassword);
    });
  });

  afterAll(closeConnection);
});
