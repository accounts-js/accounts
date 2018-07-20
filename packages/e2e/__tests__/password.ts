import { ServerTest } from './servers/server';

const server = new ServerTest();

const user = {
  // TODO test with upercase email
  email: 'johndoe@gmail.com',
  password: 'notSecure',
};
let userId: string;

describe('password', () => {
  beforeAll(async () => {
    await server.start();
  });

  describe('create a new user', () => {
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

  describe('verify user email', () => {
    it('should throw when wrong token', async () => {
      try {
        await server.accountsClientPassword.verifyEmail('wrongToken');
        throw new Error();
      } catch (error) {
        expect(error.message).toMatch('Verify email link expired');
      }
    });

    it('should request a new token for the user', async () => {
      const data = await server.accountsClientPassword.requestVerificationEmail(user.email);
      expect(data).toBeNull();
      expect(server.emails.length).toBe(1);
    });

    it('should verify the user email', async () => {
      const token = server.emails[0].text;
      const data = await server.accountsClientPassword.verifyEmail(token);
      server.emails = [];
      expect(data).toBeNull();
      // TODO check the email is verified
    });
  });

  describe('reset user password', () => {
    it('should throw when wrong token', async () => {
      try {
        await server.accountsClientPassword.resetPassword('wrongToken', 'newPassword');
        throw new Error();
      } catch (error) {
        expect(error.message).toMatch('Reset password link expired');
      }
    });

    it('should request a new token for the user', async () => {
      const data = await server.accountsClientPassword.requestPasswordReset(user.email);
      expect(data).toBeNull();
      expect(server.emails.length).toBe(1);
    });

    it('should change the user password and be able to login with it', async () => {
      const token = server.emails[0].text;
      const newPassword = 'newPasswordTest';
      const data = await server.accountsClientPassword.resetPassword(token, newPassword);
      user.password = newPassword;
      expect(data).toBeNull();

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

  describe('change password when user is logged in', () => {
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
      user.password = newPassword;
      expect(data).toBeNull();

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
