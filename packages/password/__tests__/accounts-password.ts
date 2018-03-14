import { set } from 'lodash';
import { AccountsPassword } from '../src';

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
        services: {}
      };
      const tmpAccountsPassword = new AccountsPassword({});
      tmpAccountsPassword.passwordAuthenticator = jest.fn(() => Promise.resolve(user));
      const ret = await tmpAccountsPassword.authenticate({
        user: 'toto',
        password: 'toto',
      } as any);
      expect(ret).toEqual(user);
    });

    it('return user', async () => {
      try {
        const tmpAccountsPassword = new AccountsPassword({});
        tmpAccountsPassword.passwordAuthenticator = jest.fn(() => Promise.resolve());
        await tmpAccountsPassword.authenticate({
          user: 'toto',
          password: 'toto',
        } as any);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
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

  describe('findUserByEmail', () => {
    it('call this.db.findUserByEmail', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve('user'));
      password.setStore({ findUserByEmail } as any);
      const user = await password.findUserByEmail('email');
      expect(findUserByEmail.mock.calls[0]).toMatchSnapshot();
      expect(user).toEqual('user');
    });
  });

  describe('findUserByUsername', () => {
    it('call this.db.findUserByUsername', async () => {
      const findUserByUsername = jest.fn(() => Promise.resolve('user'));
      password.setStore({ findUserByUsername } as any);
      const user = await password.findUserByUsername('email');
      expect(findUserByUsername.mock.calls[0]).toMatchSnapshot();
      expect(user).toEqual('user');
    });
  });

  describe('addEmail', () => {
    it('call this.db.addEmail', async () => {
      const addEmail = jest.fn(() => Promise.resolve());
      password.setStore({ addEmail } as any);
      await password.addEmail('id', 'email', true);
      expect(addEmail.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('removeEmail', () => {
    it('call this.db.removeEmail', async () => {
      const removeEmail = jest.fn(() => Promise.resolve());
      password.setStore({ removeEmail } as any);
      await password.removeEmail('id', 'email');
      expect(removeEmail.mock.calls[0]).toMatchSnapshot();
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
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmailVerificationToken } as any);
      try {
        await password.verifyEmail(token);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when token not found', async () => {
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve({}));
      password.setStore({ findUserByEmailVerificationToken } as any);
      try {
        await password.verifyEmail(token);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when email not found', async () => {
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve(invalidUser));
      password.setStore({ findUserByEmailVerificationToken } as any);
      try {
        await password.verifyEmail(token);
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
      await password.verifyEmail(token);
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
        await password.resetPassword(token, newPassword);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when token is expired', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(invalidUser));
      const isTokenExpired = jest.fn(() => true);
      password.setStore({ findUserByResetPasswordToken } as any);
      password.server = { isTokenExpired } as any;
      try {
        await password.resetPassword(token, newPassword);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when token have invalid email', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(invalidUser));
      const isTokenExpired = jest.fn(() => false);
      password.setStore({ findUserByResetPasswordToken } as any);
      password.server = { isTokenExpired } as any;
      try {
        await password.resetPassword(token, newPassword);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('reset password and invalidate all sessions', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(validUser));
      const isTokenExpired = jest.fn(() => false);
      const setResetPassword = jest.fn(() => Promise.resolve());
      const invalidateAllSessions = jest.fn(() => Promise.resolve());
      password.setStore({
        findUserByResetPasswordToken,
        setResetPassword,
        invalidateAllSessions,
      } as any);
      password.server = { isTokenExpired } as any;
      await password.resetPassword(token, newPassword);
      expect(setResetPassword.mock.calls.length).toBe(1);
      expect(invalidateAllSessions.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('setPassword', () => {
    it('call this.db.setPassword', async () => {
      const userId = 'id';
      const setPassword = jest.fn(() => Promise.resolve('user'));
      password.setStore({ setPassword } as any);
      const user = await password.setPassword(userId, 'new-password');
      expect(setPassword.mock.calls[0][0]).toEqual(userId);
      expect(setPassword.mock.calls[0][1]).toBeTruthy();
      expect(user).toEqual('user');
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
        await password.sendVerificationEmail('');
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail } as any);
      try {
        await password.sendVerificationEmail(email);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when invalid address', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(invalidUser));
      password.setStore({ findUserByEmail } as any);
      try {
        await password.sendVerificationEmail(email);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('send email to first unverified email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addEmailVerificationToken = jest.fn(() => Promise.resolve());
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail, addEmailVerificationToken } as any);
      password.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendVerificationEmail(verifiedEmail);
      expect(addEmailVerificationToken.mock.calls[0].length).toBe(3);
      expect(prepareMail.mock.calls[0].length).toBe(6);
      expect(sendMail.mock.calls[0].length).toBe(1);
    });

    it('send email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addEmailVerificationToken = jest.fn(() => Promise.resolve());
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail, addEmailVerificationToken } as any);
      password.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendVerificationEmail(email);
      expect(addEmailVerificationToken.mock.calls[0].length).toBe(3);
      expect(prepareMail.mock.calls[0].length).toBe(6);
      expect(sendMail.mock.calls[0].length).toBe(1);
    });
  });

  describe('sendResetPasswordEmail', () => {
    const email = 'john.doe@gmail.com';
    const validUser = { emails: [{ address: email }] };

    it('throws if email is empty', async () => {
      try {
        await password.sendResetPasswordEmail('');
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setStore({ findUserByEmail } as any);
      try {
        await password.sendResetPasswordEmail(email);
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('send email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addResetPasswordToken = jest.fn(() => Promise.resolve());
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      const getFirstUserEmail = jest.fn(() => Promise.resolve(email));
      password.setStore({ findUserByEmail, addResetPasswordToken } as any);
      password.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
        getFirstUserEmail,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendResetPasswordEmail(email);
      expect(addResetPasswordToken.mock.calls[0].length).toBe(3);
      expect(prepareMail.mock.calls[0].length).toBe(6);
      expect(sendMail.mock.calls[0].length).toBe(1);
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
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      const getFirstUserEmail = jest.fn(() => Promise.resolve(email));
      password.setStore({ findUserByEmail, addResetPasswordToken } as any);
      password.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
        getFirstUserEmail,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendEnrollmentEmail(email);
      expect(addResetPasswordToken.mock.calls[0].length).toBe(4);
      expect(prepareMail.mock.calls[0].length).toBe(6);
      expect(sendMail.mock.calls[0].length).toBe(1);
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
