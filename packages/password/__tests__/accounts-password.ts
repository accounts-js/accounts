import { set } from 'lodash';
import { AccountsPassword } from '../src';

beforeEach(jest.clearAllMocks)

const notify = jest.fn(() => Promise.resolve());

const useNotificationService = () => ({
  notify
})

describe('AccountsPassword', () => {
  const password = new AccountsPassword({});

  describe('config', () => {
    it('should have default options', async () => {
      expect(password.options.passwordResetTokenExpirationInDays).toBe(3);
    });
  });

  describe('authenticate', () => {
    it('throws on invalid params', async () => {
      try {
        await password.authenticate({} as any);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws on invalid type params', async () => {
      try {
        await password.authenticate({ user: 'toto', password: 3 } as any);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('return user', async () => {
      const user = {
        services: {},
      };
      const tmpAccountsPassword = new AccountsPassword({});
      tmpAccountsPassword.passwordAuthenticator = jest.fn(() => Promise.resolve(user));
      const ret = await tmpAccountsPassword.authenticate({
        user: 'toto',
        password: 'toto',
      } as any);
      expect(ret).toEqual(user);
    });

    it('throws when user not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail } as any);
      try {
        await password.authenticate({
          user: 'toto@toto.com',
          password: 'toto',
        } as any);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when hash not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve({ id: 'id' }));
      const findPasswordHash = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail, findPasswordHash } as any);
      try {
        await password.authenticate({
          user: 'toto@toto.com',
          password: 'toto',
        } as any);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws on incorrect password', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve({ id: 'id' }));
      const findPasswordHash = jest.fn(() => Promise.resolve('hash'));
      password.setStore({ findUserByEmail, findPasswordHash } as any);
      try {
        await password.authenticate({
          user: 'toto@toto.com',
          password: 'toto',
        } as any);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });
  });

  describe('verifyEmail', () => {
    const token = 'token';
    const validUser: any = {};
    const email = 'john.doe@gmail.com';
    set(validUser, 'services.email.verificationTokens', [{ token, address: email }]);
    validUser.emails = [{ address: email }];
    const invalidUser = { ...validUser };
    invalidUser.emails = [];

    it('throws when no user is found', async () => {
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve(undefined));
      password.setStore({ findUserByEmailVerificationToken } as any);
      try {
        await password.verifyEmail({token});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when token not found', async () => {
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve({}));
      password.setStore({ findUserByEmailVerificationToken } as any);
      try {
        await password.verifyEmail({token});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when email not found', async () => {
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve(invalidUser));
      password.setStore({ findUserByEmailVerificationToken } as any);
      try {
        await password.verifyEmail({token});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('call this.db.verifyEmail', async () => {
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve(validUser));
      const verifyEmail = jest.fn(() => Promise.resolve());
      password.setStore({
        findUserByEmailVerificationToken,
        verifyEmail,
      } as any);
      await password.verifyEmail({token});
      expect(verifyEmail.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('resetPassword', () => {
    const token = 'token';
    const newPassword = 'newPassword';
    const email = 'john.doe@gmail.com';
    const validUser: any = {
      id: 'id',
    };
    set(validUser, 'services.password.reset', [{ token, address: email }]);
    validUser.emails = [{ address: email }];
    const invalidUser = { ...validUser };
    invalidUser.emails = [];

    it('throws when token not found', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByResetPasswordToken } as any);
      try {
        await password.resetPassword({token, newPassword});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when token is expired', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(invalidUser));
      const isEmailTokenExpired = jest.fn(() => true);
      password.setStore({ findUserByResetPasswordToken } as any);
      password.server = { tokenManager: { isEmailTokenExpired } } as any;
      try {
        await password.resetPassword({token, newPassword});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when token have invalid email', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(invalidUser));
      const isEmailTokenExpired = jest.fn(() => false);
      password.setStore({ findUserByResetPasswordToken } as any);
      password.server = { tokenManager: { isEmailTokenExpired } } as any;
      try {
        await password.resetPassword({token, newPassword});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('reset password and invalidate all sessions', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(validUser));
      const isEmailTokenExpired = jest.fn(() => false);
      const setResetPassword = jest.fn(() => Promise.resolve());
      const invalidateAllSessions = jest.fn(() => Promise.resolve());
      password.setStore({
        findUserByResetPasswordToken,
        setResetPassword,
        invalidateAllSessions,
      } as any);
      password.server = { tokenManager: { isEmailTokenExpired } } as any;
      await password.resetPassword({token, newPassword});
      expect(setResetPassword.mock.calls.length).toBe(1);
      expect(invalidateAllSessions.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('sendVerificationEmail', () => {
    const email = 'john.doe@gmail.com';
    const verifiedEmail = 'john.doe2@gmail.com';
    const validUser = {
      emails: [{ address: email }, { address: verifiedEmail, verified: true }],
    };
    const invalidUser = {};

    it('throws if email is empty', async () => {
      try {
        await password.sendVerificationEmail({address:''});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail } as any);
      try {
        await password.sendVerificationEmail({address: email});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when invalid address', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(invalidUser));
      password.setStore({ findUserByEmail } as any);
      try {
        await password.sendVerificationEmail({address: email});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('send email to first unverified email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addEmailVerificationToken = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const notify = jest.fn(() => Promise.resolve());
      const useNotificationService = () => ({
        notify
      })
      password.setStore({ findUserByEmail, addEmailVerificationToken } as any);
      password.server = {
        useNotificationService,
        sanitizeUser,
        tokenManager: {
          generateRandomToken: () => 'randomToken'
        }
      } as any;

      await password.sendVerificationEmail({address: verifiedEmail});
      expect(addEmailVerificationToken.mock.calls[0].length).toBe(3);
      expect(notify).toBeCalled()
    });

    it('send email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addEmailVerificationToken = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail, addEmailVerificationToken } as any);
      password.server = {
        useNotificationService,
        sanitizeUser,
        tokenManager: {
          generateRandomToken: () => 'randomToken'
        }
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendVerificationEmail({address: email});
      expect(addEmailVerificationToken.mock.calls[0].length).toBe(3);
      expect(notify).toBeCalled()
    });
  });

  describe('sendResetPasswordEmail', () => {
    const email = 'john.doe@gmail.com';
    const validUser = { emails: [{ address: email }] };

    it('throws if email is empty', async () => {
      try {
        await password.sendResetPasswordEmail({address: ''});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail } as any);
      try {
        await password.sendResetPasswordEmail({address: email});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('send email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addResetPasswordToken = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const getFirstUserEmail = jest.fn(() => Promise.resolve(email));
      password.setStore({ findUserByEmail, addResetPasswordToken } as any);
      password.server = {
        useNotificationService,
        sanitizeUser,
        getFirstUserEmail,
        tokenManager: {
          generateRandomToken: () => 'randomToken'
        }
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendResetPasswordEmail({address: email});
      expect(addResetPasswordToken.mock.calls[0].length).toBe(3);
      expect(notify).toBeCalled()
    });
  });

  describe('sendEnrollmentEmail', () => {
    const email = 'john.doe@gmail.com';
    const validUser = { emails: [{ address: email }] };

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail } as any);
      try {
        await password.sendEnrollmentEmail(email);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('send email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addResetPasswordToken = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const getFirstUserEmail = jest.fn(() => Promise.resolve(email));
      password.setStore({ findUserByEmail, addResetPasswordToken } as any);
      password.server = {
        useNotificationService,
        sanitizeUser,
        getFirstUserEmail,
        tokenManager: {
          generateRandomToken: () => 'randomToken'
        }
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendEnrollmentEmail(email);
      expect(addResetPasswordToken.mock.calls[0].length).toBe(4);
      expect(notify).toBeCalled()
    });
  });

  describe('createUser', async () => {
    it('throws on required fields', async () => {
      try {
        await password.createUser({
          password: '123456',
          username: '',
          email: '',
        });
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when username already exists', async () => {
      const findUserByUsername = jest.fn(() => Promise.resolve('user'));
      password.setStore({ findUserByUsername } as any);
      try {
        await password.createUser({
          password: '123456',
          username: 'user1',
        });
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when email already exists', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve('user'));
      password.setStore({ findUserByEmail } as any);
      try {
        await password.createUser({
          password: '123456',
          email: 'email1@email.com',
        });
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws if validateNewUser does not pass', async () => {
      const tmpAccountsPassword = new AccountsPassword({
        validateNewUser: () => Promise.resolve(false),
      });
      const findUserByEmail = jest.fn(() => Promise.resolve());
      tmpAccountsPassword.setStore({ findUserByEmail } as any);
      try {
        await tmpAccountsPassword.createUser({
          password: '123456',
          email: 'email1@email.com',
        });
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('create user', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      const createUser = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail, createUser } as any);
      await password.createUser({
        password: '123456',
        email: 'email1@email.com',
      });
      expect(findUserByEmail.mock.calls.length).toBe(1);
      expect(createUser.mock.calls.length).toBe(1);
    });
  });
});
