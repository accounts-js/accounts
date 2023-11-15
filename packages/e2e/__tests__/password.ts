import 'reflect-metadata';
import { servers } from './servers';

const user = {
  email: 'johnDoe@gmail.com',
  password: 'notSecure',
};

Object.keys(servers).forEach((key) => {
  const server = servers[key];
  describe(`${key} password`, () => {
    beforeAll(async () => {
      await server.start();
    });

    describe('create a new user', () => {
      it('should create a new user with email and password', async () => {
        const { userId } = await server.accountsClientPassword.createUser({
          email: user.email,
          password: user.password,
        });
        expect(typeof userId).toEqual('string');
      });
    });

    describe('login', () => {
      it('should throw when wrong credentials', async () => {
        await expect(
          server.accountsClientPassword.login({
            user: {
              email: 'toto@google.com',
            },
            password: 'heya',
          })
        ).rejects.toThrow('Invalid credentials');
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
        await expect(server.accountsClientPassword.verifyEmail('wrongToken')).rejects.toThrow(
          'Verify email link expired'
        );
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
        const dbUser = await server.accountsDatabase.findUserByEmail(user.email);
        expect(dbUser!.emails![0].verified).toBe(true);
      });
    });

    describe('reset user password', () => {
      it('should throw when wrong token', async () => {
        await expect(
          server.accountsClientPassword.resetPassword('wrongToken', 'newPassword')
        ).rejects.toThrow('Reset password link expired');
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
        await expect(
          server.accountsClientPassword.changePassword('wrongPassword', 'newPassword')
        ).rejects.toThrow('Invalid credential');
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
});
