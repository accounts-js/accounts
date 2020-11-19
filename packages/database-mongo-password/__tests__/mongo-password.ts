import { User } from '@accounts/types';
import { MongoClient, Db, ObjectID } from 'mongodb';
import { MongoServicePassword } from '../src/mongo-password';

const user = {
  username: 'johndoe',
  email: 'john@doe.com',
  password: 'toto',
};

describe('MongoServicePassword', () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('#constructor', () => {
    it('should have default options', () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      expect((mongoServicePassword as any).options).toBeTruthy();
    });

    it('should overwrite options', () => {
      const mongoServicePassword = new MongoServicePassword({
        db,
        userCollectionName: 'usersTest',
      });
      expect((mongoServicePassword as any).options.userCollectionName).toEqual('usersTest');
    });
  });

  describe('setupIndexes', () => {
    it('should create indexes', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      await mongoServicePassword.setupIndexes();
      const ret = await db.collection('users').indexInformation();
      expect(ret).toBeTruthy();
      expect(ret).toEqual({
        _id_: [['_id', 1]],
        'emails.address_1': [['emails.address', 1]],
        'services.email.verificationTokens.token_1': [
          ['services.email.verificationTokens.token', 1],
        ],
        'services.password.reset.token_1': [['services.password.reset.token', 1]],
        username_1: [['username', 1]],
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser(user);
      const ret = await mongoServicePassword.findUserById(userId);
      expect(userId).toBeTruthy();
      expect(ret).toEqual({
        _id: expect.any(ObjectID),
        id: expect.any(String),
        username: 'johndoe',
        emails: [
          {
            address: user.email,
            verified: false,
          },
        ],
        services: {
          password: {
            bcrypt: 'toto',
          },
        },
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });
    });

    it('should not overwrite service', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser({
        ...user,
        services: 'test',
      });
      const ret = await mongoServicePassword.findUserById(userId);
      expect(userId).toBeTruthy();
      expect(ret!.services).toEqual({
        password: {
          bcrypt: 'toto',
        },
      });
    });

    it('should not set username', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser({
        email: user.email,
        password: user.password,
      });
      const ret = await mongoServicePassword.findUserById(userId);
      expect(ret!.id).toBeTruthy();
      expect(ret!.username).not.toBeTruthy();
    });

    it('should not set email', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser({
        username: user.username,
        password: user.password,
      });
      const ret = await mongoServicePassword.findUserById(userId);
      expect(ret!.id).toBeTruthy();
      expect(ret!.emails).not.toBeTruthy();
    });

    it('email should be lowercase', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser({
        email: 'JohN@doe.com',
        password: user.password,
      });
      const ret = await mongoServicePassword.findUserById(userId);
      expect(ret!.id).toBeTruthy();
      expect(ret!.emails![0].address).toEqual('john@doe.com');
    });

    it('call options.idProvider', async () => {
      const mongoServicePassword = new MongoServicePassword({
        db,
        idProvider: () => 'toto',
        convertUserIdToMongoObjectId: false,
      });
      const userId = await mongoServicePassword.createUser({
        email: 'JohN@doe.com',
        password: user.password,
      });
      const ret = await mongoServicePassword.findUserById(userId);
      expect(userId).toBe('toto');
      expect(ret!.id).toBeTruthy();
      expect(ret!.emails![0].address).toEqual('john@doe.com');
    });
  });

  describe('findUserById', () => {
    it('should return null for not found user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const ret = await mongoServicePassword.findUserById('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser(user);
      const ret = await mongoServicePassword.findUserById(userId);
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });
});
