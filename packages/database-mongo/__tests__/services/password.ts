import { ObjectId } from 'mongodb';
import { DatabaseTests } from '../test-utils';
import { Mongo } from '../../src/mongo';
import { MongoServicePassword } from '../../src/services/password';

const databaseTests = new DatabaseTests();

const user = {
  username: 'johndoe',
  email: 'john@doe.com',
  password: 'toto',
};

describe('services/password', () => {
  beforeAll(databaseTests.setup);
  afterAll(databaseTests.teardown);
  beforeEach(databaseTests.beforeEach);

  describe('findUserByResetPasswordToken', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByResetPasswordToken('token');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addResetPasswordToken(userId, 'john@doe.com', 'token', 'test');
      const ret = await databaseTests.database.findUserByResetPasswordToken('token');
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findUserByEmailVerificationToken', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByEmailVerificationToken('token');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmailVerificationToken(userId, 'john@doe.com', 'token');
      const ret = await databaseTests.database.findUserByEmailVerificationToken('token');
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findPasswordHash', () => {
    it('should not convert id', async () => {
      const mongoOptions = new MongoServicePassword(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      await expect(mongoOptions.findPasswordHash('toto')).resolves.toBe(null);
    });

    it('should return null on not found user', async () => {
      const ret = await databaseTests.database.findPasswordHash('589871d1c9393d445745a57c');
      expect(ret).toEqual(null);
    });

    it('should return hash', async () => {
      const userId = await databaseTests.database.createUser(user);
      const retUser = await databaseTests.database.findUserById(userId);
      const ret = await databaseTests.database.findPasswordHash(userId);
      const services: any = retUser!.services;
      expect(ret).toBeTruthy();
      expect(ret).toEqual(services.password.bcrypt);
    });
  });

  describe('setPassword', () => {
    it('should not convert id', async () => {
      const mongoOptions = new MongoServicePassword(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      await expect(mongoOptions.setPassword('toto', 'hey')).rejects.toThrowError('User not found');
    });

    it('should throw if user is not found', async () => {
      await expect(
        databaseTests.database.setPassword('589871d1c9393d445745a57c', 'toto')
      ).rejects.toThrowError('User not found');
    });

    it('should change password', async () => {
      const newPassword = 'newpass';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.setPassword(userId, newPassword);
      const retUser = await databaseTests.database.findUserById(userId);
      const services: any = retUser!.services;
      expect(services.password.bcrypt).toBeTruthy();
      expect(services.password.bcrypt).toEqual(newPassword);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });

  describe('addEmailVerificationToken', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
        idProvider: () => new ObjectId().toString(),
      });
      const userId = await mongoOptions.createUser(user);
      await mongoOptions.addEmailVerificationToken(userId, 'john@doe.com', 'token');
    });

    it('should add a token', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmailVerificationToken(userId, 'john@doe.com', 'token');
      const retUser = await databaseTests.database.findUserById(userId);
      const services: any = retUser!.services;
      expect(services.email.verificationTokens.length).toEqual(1);
      expect(services.email.verificationTokens[0].address).toEqual('john@doe.com');
      expect(services.email.verificationTokens[0].token).toEqual('token');
      expect(services.email.verificationTokens[0].when).toBeTruthy();
    });
  });

  describe('addResetPasswordToken', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
        idProvider: () => new ObjectId().toString(),
      });
      const userId = await mongoOptions.createUser(user);
      await mongoOptions.addResetPasswordToken(userId, 'john@doe.com', 'token', 'reset');
    });

    it('should add a token', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addResetPasswordToken(userId, 'john@doe.com', 'token', 'reset');
      const retUser = await databaseTests.database.findUserById(userId);
      const services: any = retUser!.services;
      expect(services.password.reset.length).toEqual(1);
      expect(services.password.reset[0].address).toEqual('john@doe.com');
      expect(services.password.reset[0].token).toEqual('token');
      expect(services.password.reset[0].when).toBeTruthy();
      expect(services.password.reset[0].reason).toEqual('reset');
    });
  });

  describe('setResetPassword', () => {
    it('should change password', async () => {
      const newPassword = 'newpass';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.setResetPassword(userId, 'toto', newPassword, 'token');
      const retUser = await databaseTests.database.findUserById(userId);
      const services: any = retUser!.services;
      expect(services.password.bcrypt).toBeTruthy();
      expect(services.password.bcrypt).toEqual(newPassword);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });

  describe('addEmail', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
        idProvider: () => new ObjectId().toString(),
      });
      const userId = await mongoOptions.createUser(user);
      await mongoOptions.addEmail(userId, 'hey', false);
    });

    it('should throw if user is not found', async () => {
      await expect(
        databaseTests.database.addEmail('589871d1c9393d445745a57c', 'unknowemail', false)
      ).rejects.toThrowError('User not found');
    });

    it('should add email', async () => {
      const email = 'johns@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmail(userId, email, false);
      const retUser = await databaseTests.database.findUserByEmail(email);
      expect(retUser!.emails!.length).toEqual(2);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });

    it('should add lowercase email', async () => {
      const email = 'johnS@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmail(userId, email, false);
      const retUser = await databaseTests.database.findUserByEmail(email);
      expect(retUser!.emails!.length).toEqual(2);
      expect(retUser!.emails![1].address).toEqual('johns@doe.com');
    });
  });

  describe('removeEmail', () => {
    // it('should not convert id', async () => {
    //   const mongoOptions = new Mongo(databaseTests.db, {
    //     convertUserIdToMongoObjectId: false,
    //     idProvider: () => new ObjectId().toString(),
    //   });
    //   const userId = await mongoOptions.createUser(user);
    //   await mongoOptions.removeEmail(userId, 'hey');
    // });

    it('should throw if user is not found', async () => {
      await expect(
        databaseTests.database.removeEmail('589871d1c9393d445745a57c', 'unknowemail')
      ).rejects.toThrowError('User not found');
    });

    it('should remove email', async () => {
      const email = 'johns@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmail(userId, email, false);
      await databaseTests.database.removeEmail(userId, user.email);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.emails!.length).toEqual(1);
      expect(retUser!.emails![0].address).toEqual(email);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });

    it('should remove uppercase email', async () => {
      const email = 'johns@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmail(userId, email, false);
      await databaseTests.database.removeEmail(userId, 'JOHN@doe.com');
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.emails!.length).toEqual(1);
      expect(retUser!.emails![0].address).toEqual(email);
    });
  });

  describe('verifyEmail', () => {
    // it('should not convert id', async () => {
    //   const mongoOptions = new Mongo(databaseTests.db, {
    //     convertUserIdToMongoObjectId: false,
    //   });
    //   await expect(mongoOptions.verifyEmail('toto', 'hey')).rejects.toThrowError('User not found');
    // });

    it('should throw if user is not found', async () => {
      await expect(
        databaseTests.database.verifyEmail('589871d1c9393d445745a57c', 'unknowemail')
      ).rejects.toThrowError('User not found');
    });

    it('should verify email', async () => {
      const userId = await databaseTests.database.createUser(user);
      let retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.emails!.length).toEqual(1);
      expect(retUser!.emails![0].address).toBe(user.email);
      expect(retUser!.emails![0].verified).toBe(false);
      await databaseTests.database.verifyEmail(userId, user.email);
      retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.emails!.length).toEqual(1);
      expect(retUser!.emails![0].address).toBe(user.email);
      expect(retUser!.emails![0].verified).toBe(true);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });
});
