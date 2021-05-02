import { MongoClient, Db, ObjectId } from 'mongodb';
import { MongoServiceToken } from '../src/';
import { MongoServicePassword } from '@accounts/mongo-password';

const user = {
  username: 'johndoe',
  email: 'john@doe.com',
  password: 'toto',
};

describe('MongoServiceToken', () => {
  let connection: MongoClient;
  let database: Db;

  beforeAll(async () => {
    const url = 'mongodb://localhost:27017';
    connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    database = await connection.db('accounts-mongo-token-tests');
  });

  beforeEach(async () => {
    await database.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('#constructor', () => {
    it('should have default options', () => {
      const mongoServicePassword = new MongoServicePassword({ database });
      const mongoServiceToken = new MongoServiceToken({
        database,
        password: mongoServicePassword,
      });
      expect((mongoServiceToken as any).options).toBeTruthy();
    });

    it('should overwrite options', () => {
      const mongoServicePassword = new MongoServicePassword({ database });
      const mongoServiceToken = new MongoServiceToken({
        database,
        password: mongoServicePassword,
        userCollectionName: 'usersTest',
      });
      expect((mongoServiceToken as any).options.userCollectionName).toEqual('usersTest');
    });
  });

  describe('setupIndexes', () => {
    it('should create indexes', async () => {
      const mongoServicePassword = new MongoServicePassword({ database });
      const mongoServiceToken = new MongoServiceToken({
        database,
        password: mongoServicePassword,
      });
      await mongoServiceToken.setupIndexes();
      const ret = await database.collection('users').indexInformation();
      expect(ret).toEqual({
        _id_: [['_id', 1]],
        'services.token.loginTokens.token_1': [['services.token.loginTokens.token', 1]],
      });
    });
  });

  describe('findUserByLoginToken', () => {
    it('should return null for not found user', async () => {
      const mongoServicePassword = new MongoServicePassword({ database });
      const mongoServiceToken = new MongoServiceToken({
        database,
        password: mongoServicePassword,
      });
      const ret = await mongoServiceToken.findUserByLoginToken('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const mongoServicePassword = new MongoServicePassword({ database });
      const mongoServiceToken = new MongoServiceToken({
        database,
        password: mongoServicePassword,
      });
      const userId = await mongoServicePassword.createUser(user);

      const token = 'generatedToken';
      await mongoServiceToken.addLoginToken(userId, user.email, token);

      const ret = await mongoServiceToken.findUserByLoginToken(token);
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });

    describe('addLoginToken', () => {
      // eslint-disable-next-line jest/expect-expect
      it('should not convert id', async () => {
        const mongoServicePassword = new MongoServicePassword({
          database,
          convertUserIdToMongoObjectId: false,
          idProvider: () => new ObjectId().toString(),
        });
        const mongoServiceToken = new MongoServiceToken({
          database,
          password: mongoServicePassword,
        });
        const userId = await mongoServicePassword.createUser(user);
        await expect(
          mongoServiceToken.addLoginToken(userId, 'john@doe.com', 'token')
        ).resolves.not.toThrowError();
      });

      it('should add a token', async () => {
        const mongoServicePassword = new MongoServicePassword({ database });
        const mongoServiceToken = new MongoServiceToken({
          database,
          password: mongoServicePassword,
        });
        const userId = await mongoServicePassword.createUser(user);
        await mongoServiceToken.addLoginToken(userId, 'john@doe.com', 'token');
        const retUser = await mongoServiceToken.findUserByLoginToken('token');
        const services: any = retUser!.services;
        expect(services.token.loginTokens.length).toEqual(1);
        expect(services.token.loginTokens[0].address).toEqual('john@doe.com');
        expect(services.token.loginTokens[0].token).toEqual('token');
        expect(services.token.loginTokens[0].when).toBeTruthy();
      });
    });

    describe('removeAllLoginTokens', () => {
      it('should not convert id', async () => {
        const mongoServicePassword = new MongoServicePassword({
          database,
          convertUserIdToMongoObjectId: false,
        });
        const mongoServiceToken = new MongoServiceToken({
          database,
          password: mongoServicePassword,
        });
        const userId = await mongoServicePassword.createUser(user);
        await expect(mongoServiceToken.removeAllLoginTokens(userId)).resolves.not.toThrowError();
      });

      it('should remove the login tokens', async () => {
        const mongoServicePassword = new MongoServicePassword({ database });
        const mongoServiceToken = new MongoServiceToken({
          database,
          password: mongoServicePassword,
        });
        const testToken = 'testLoginToken';
        const userId = await mongoServicePassword.createUser(user);
        await mongoServiceToken.addLoginToken(userId, user.email, testToken);
        const userWithTokens = await mongoServiceToken.findUserByLoginToken(testToken);
        expect(userWithTokens).toBeTruthy();
        await mongoServiceToken.removeAllLoginTokens(userId);
        const userWithDeletedTokens = await mongoServiceToken.findUserByLoginToken(testToken);
        expect(userWithDeletedTokens).not.toBeTruthy();
      });
    });
  });
});
