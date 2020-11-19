import { MongoClient, Db, ObjectID, ObjectId } from 'mongodb';
import { MongoServicePassword } from '../src/mongo-password';

function delay(time: number) {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
}

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

  describe('findUserByEmail', () => {
    it('should return null for not found user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const ret = await mongoServicePassword.findUserByEmail('unknow@user.com');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      await mongoServicePassword.createUser(user);
      const ret = await mongoServicePassword.findUserByEmail(user.email);
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });

    it('should return user with uppercase email', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      await mongoServicePassword.createUser({ email: 'JOHN@DOES.COM', password: user.password });
      const ret = await mongoServicePassword.findUserByEmail('JOHN@DOES.COM');
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.emails![0].address).toEqual('john@does.com');
    });
  });

  describe('findUserByUsername', () => {
    it('should return null for not found user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const ret = await mongoServicePassword.findUserByUsername('unknowuser');
      expect(ret).not.toBeTruthy();
    });

    it('should return username for case insensitive query', async () => {
      const mongoServicePassword = new MongoServicePassword({ db, caseSensitiveUserName: false });
      await mongoServicePassword.createUser(user);
      const ret = await mongoServicePassword.findUserByUsername(user.username.toUpperCase());
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });

    it('should return null for incomplete matching user when using insensitive', async () => {
      const mongoServicePassword = new MongoServicePassword({ db, caseSensitiveUserName: false });
      const ret = await mongoServicePassword.findUserByUsername('john');
      expect(ret).not.toBeTruthy();
    });

    it('should return null when using regex wildcards when using insensitive', async () => {
      const mongoServicePassword = new MongoServicePassword({ db, caseSensitiveUserName: false });
      const ret = await mongoServicePassword.findUserByUsername('*');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      await mongoServicePassword.createUser(user);
      const ret = await mongoServicePassword.findUserByUsername(user.username);
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findUserByEmailVerificationToken', () => {
    it('should return null for not found user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const ret = await mongoServicePassword.findUserByEmailVerificationToken('token');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser(user);
      await mongoServicePassword.addEmailVerificationToken(userId, 'john@doe.com', 'token');
      const ret = await mongoServicePassword.findUserByEmailVerificationToken('token');
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findUserByResetPasswordToken', () => {
    it('should return null for not found user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const ret = await mongoServicePassword.findUserByResetPasswordToken('token');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser(user);
      await mongoServicePassword.addResetPasswordToken(userId, 'john@doe.com', 'token', 'test');
      const ret = await mongoServicePassword.findUserByResetPasswordToken('token');
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findPasswordHash', () => {
    it('should not convert id', async () => {
      const mongoServicePassword = new MongoServicePassword({
        db,
        convertUserIdToMongoObjectId: false,
      });
      await expect(mongoServicePassword.findPasswordHash('toto')).resolves.toBe(null);
    });

    it('should return null on not found user', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const ret = await mongoServicePassword.findPasswordHash('589871d1c9393d445745a57c');
      expect(ret).toEqual(null);
    });

    it('should return hash', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const userId = await mongoServicePassword.createUser(user);
      const retUser = await mongoServicePassword.findUserById(userId);
      const ret = await mongoServicePassword.findPasswordHash(userId);
      const services: any = retUser!.services;
      expect(ret).toBeTruthy();
      expect(ret).toEqual(services.password.bcrypt);
    });
  });

  describe('addEmail', () => {
    it('should not convert id', async () => {
      const mongoServicePassword = new MongoServicePassword({
        db,
        convertUserIdToMongoObjectId: false,
        idProvider: () => new ObjectId().toString(),
      });
      const userId = await mongoServicePassword.createUser(user);
      await mongoServicePassword.addEmail(userId, 'hey', false);
      const retUser = await mongoServicePassword.findUserById(userId);
      expect(typeof (retUser as any)._id).toBe('string');
    });

    it('should throw if user is not found', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      await expect(
        mongoServicePassword.addEmail('589871d1c9393d445745a57c', 'unknowemail', false)
      ).rejects.toThrowError('User not found');
    });

    it('should add email', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const email = 'johns@doe.com';
      const userId = await mongoServicePassword.createUser(user);
      await delay(10);
      await mongoServicePassword.addEmail(userId, email, false);
      const retUser = await mongoServicePassword.findUserByEmail(email);
      expect(retUser!.emails!.length).toEqual(2);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });

    it('should add lowercase email', async () => {
      const mongoServicePassword = new MongoServicePassword({ db });
      const email = 'johnS@doe.com';
      const userId = await mongoServicePassword.createUser(user);
      await mongoServicePassword.addEmail(userId, email, false);
      const retUser = await mongoServicePassword.findUserByEmail(email);
      expect(retUser!.emails!.length).toEqual(2);
      expect(retUser!.emails![1].address).toEqual('johns@doe.com');
    });
  });
});
