import { ServerTest } from './servers/server';

const server = new ServerTest();

const user = {
  email: 'johnDoe@gmail.com',
  password: 'notSecure',
};
let userId: string;

describe('password', () => {
  beforeAll(async () => {
    await server.start();
  });

  describe('createUser', () => {
    it('should create a new user with email and password', async () => {
      userId = await server.accountsClientPassword.createUser({
        email: user.email,
        password: user.password,
      });
      expect(userId).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should throw when wrong creadentials', async () => {
      try {
        await server.accountsClientPassword.login({
          user: {
            email: 'toto@google.com',
          },
          password: 'heya',
        });
        throw new Error();
      } catch (error) {
        expect(error.message).toMatch('User not found');
      }
    });

    it('should login the user and get the session', async () => {
      const loginResult = await server.accountsClientPassword.login({
        user: {
          email: user.email,
        },
        password: user.password,
      });
      expect(loginResult.sessionId).toBeTruthy();
      expect(loginResult.tokens.accessToken).toBeTruthy();
      expect(loginResult.tokens.refreshToken).toBeTruthy();
    });
  });

  describe('verifyEmail', () => {
    it('should throw when wrong token', async () => {
      try {
        await server.accountsClientPassword.verifyEmail('wrongToken');
        throw new Error();
      } catch (error) {
        expect(error.message).toMatch('Verify email link expired');
      }
    });

    it('should verify the user email', () => {
      // TODO
    });
  });

  describe('changePassword', () => {
    it('should throw when wrong password', async () => {
      try {
        await server.accountsClientPassword.changePassword('wrongPassword', 'newPassword');
        throw new Error();
      } catch (error) {
        expect(error.message).toMatch('Incorrect password');
      }
    });

    it('should change the user password and be able to login with it', async () => {
      const newPassword = 'newPasswordTest';
      const data = await server.accountsClientPassword.changePassword(user.password, newPassword);
      expect(data).toBeNull();
      user.password = newPassword;

      const loginResult = await server.accountsClientPassword.login({
        user: {
          email: user.email,
        },
        password: user.password,
      });
      expect(loginResult.sessionId).toBeTruthy();
      expect(loginResult.tokens.accessToken).toBeTruthy();
      expect(loginResult.tokens.refreshToken).toBeTruthy();
    });
  });

  afterAll(async () => {
    await server.stop();
  });
});
