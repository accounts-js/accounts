import 'reflect-metadata';
import set from 'lodash.set';
import { AccountsPassword } from '../src';
import { AccountsServer } from '@accounts/server';

describe('AccountsPassword', () => {
  const server: any = {
    options: {},
    getHooks: () => ({
      emit: jest.fn(),
    }),
    loginWithUser: jest.fn(),
  };
  const password = new AccountsPassword({});
  password.server = server;

  afterEach(() => {
    password.server = server;
    jest.clearAllMocks();
  });

  describe('config', () => {
    it('should throw if requireEmailVerification and enableAutologin flags enabled at the same time', async () => {
      expect(
        () =>
          new AccountsPassword(
            { requireEmailVerification: true },
            undefined,
            undefined,
            new AccountsServer({ enableAutologin: true, tokenSecret: 'secret' }, {}, {} as any)
          )
      ).toThrow(
        "Can't enable autologin when requireEmailVerification is enabled. Please set either of them to false."
      );
    });

    it('should have default options', async () => {
      expect((password as any).options.passwordEnrollTokenExpiration).toBe(2592000000);
    });
  });

  describe('authenticate', () => {
    it('throws on invalid params', async () => {
      await expect(password.authenticate({} as any)).rejects.toThrow(
        'Unrecognized options for login request'
      );
    });

    it('throws on invalid type params', async () => {
      await expect(password.authenticate({ user: 'toto', password: 3 } as any)).rejects.toThrow(
        'Match failed'
      );
    });

    it('return user', async () => {
      const user = {
        services: {},
      };
      const tmpAccountsPassword = new AccountsPassword({});
      (tmpAccountsPassword as any).passwordAuthenticator = jest.fn(() => Promise.resolve(user));
      const ret = await tmpAccountsPassword.authenticate({
        user: 'toto',
        password: 'toto',
      } as any);
      expect(ret).toEqual(user);
    });

    it('throws when email has not been verified and requireEmailVerification is true', async () => {
      const findUserByEmail = jest.fn(() =>
        Promise.resolve({
          emails: [
            {
              address: 'toto@toto.com',
              verified: false,
            },
          ],
          id: '1',
          deactivated: false,
        })
      );
      const findPasswordHash = jest.fn(() => Promise.resolve('hashed'));
      const verifyPassword = jest.fn(() => true);
      const tmpAccountsPassword = new AccountsPassword({});
      tmpAccountsPassword.options.verifyPassword = verifyPassword as any;
      tmpAccountsPassword.options.requireEmailVerification = true;
      tmpAccountsPassword.setUserStore({ findUserByEmail, findPasswordHash } as any);
      tmpAccountsPassword.setSessionsStore();
      await expect(
        tmpAccountsPassword.authenticate({
          user: 'toto@toto.com',
          password: 'toto',
        } as any)
      ).rejects.toThrow('Email not verified');
    });

    it('throws when user not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail } as any);
      password.setSessionsStore();
      await expect(
        password.authenticate({
          user: 'toto@toto.com',
          password: 'toto',
        } as any)
      ).rejects.toThrow('User not found');
    });

    it('throws when hash not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve({ id: 'id' }));
      const findPasswordHash = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail, findPasswordHash } as any);
      password.setSessionsStore();
      await expect(
        password.authenticate({
          user: 'toto@toto.com',
          password: 'toto',
        } as any)
      ).rejects.toThrow('User has no password set');
    });

    it('throws on incorrect password', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve({ id: 'id' }));
      const findPasswordHash = jest.fn(() => Promise.resolve('hash'));
      password.setUserStore({ findUserByEmail, findPasswordHash } as any);
      password.setSessionsStore();
      await expect(
        password.authenticate({
          user: 'toto@toto.com',
          password: 'toto',
        } as any)
      ).rejects.toThrow('Incorrect password');
    });
  });

  describe('findUserByEmail', () => {
    it('call this.db.findUserByEmail', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve('user'));
      password.setUserStore({ findUserByEmail } as any);
      password.setSessionsStore();
      const user = await password.findUserByEmail('email');
      expect(findUserByEmail.mock.calls[0]).toMatchSnapshot();
      expect(user).toEqual('user');
    });
  });

  describe('findUserByUsername', () => {
    it('call this.db.findUserByUsername', async () => {
      const findUserByUsername = jest.fn(() => Promise.resolve('user'));
      password.setUserStore({ findUserByUsername } as any);
      password.setSessionsStore();
      const user = await password.findUserByUsername('email');
      expect(findUserByUsername.mock.calls[0]).toMatchSnapshot();
      expect(user).toEqual('user');
    });
  });

  describe('addEmail', () => {
    it('throws on invalid email', async () => {
      expect(() => password.addEmail('id', 'email', true)).toThrow('Invalid email');
    });

    it('call this.db.addEmail', async () => {
      const addEmail = jest.fn(() => Promise.resolve());
      password.setUserStore({ addEmail } as any);
      password.setSessionsStore();
      await password.addEmail('id', 'john.doe@gmail.com', true);
      expect(addEmail.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('removeEmail', () => {
    it('call this.db.removeEmail', async () => {
      const removeEmail = jest.fn(() => Promise.resolve());
      password.setUserStore({ removeEmail } as any);
      password.setSessionsStore();
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

    it('throws on invalid token', async () => {
      await expect(password.verifyEmail('')).rejects.toThrow('Invalid token');
    });

    it('throws when no user is found', async () => {
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmailVerificationToken } as any);
      password.setSessionsStore();
      await expect(password.verifyEmail(token)).rejects.toThrow('Verify email link expired');
    });

    it('throws when token not found', async () => {
      const isTokenExpired = jest.fn(() => true);
      password.server = { isTokenExpired } as any;
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve({}));
      password.setUserStore({ findUserByEmailVerificationToken } as any);
      password.setSessionsStore();
      await expect(password.verifyEmail(token)).rejects.toThrow('Verify email link expired');
    });

    it('throws when email not found', async () => {
      const isTokenExpired = jest.fn(() => false);
      password.server = { isTokenExpired } as any;
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve(invalidUser));
      password.setUserStore({ findUserByEmailVerificationToken } as any);
      password.setSessionsStore();
      await expect(password.verifyEmail(token)).rejects.toThrow(
        'Verify email link is for unknown address'
      );
    });

    it('call this.db.verifyEmail', async () => {
      const isTokenExpired = jest.fn(() => false);
      password.server = { isTokenExpired } as any;
      const findUserByEmailVerificationToken = jest.fn(() => Promise.resolve(validUser));
      const verifyEmail = jest.fn(() => Promise.resolve());
      password.setUserStore({
        findUserByEmailVerificationToken,
        verifyEmail,
      } as any);
      password.setSessionsStore();
      await password.verifyEmail(token);
      expect(verifyEmail.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('resetPassword', () => {
    const connectionInfo = {
      userAgent: 'user-agent-test',
      ip: 'ip-test',
    };
    const token = 'token';
    const newPassword = 'newPassword';
    const email = 'john.doe@gmail.com';
    const validUser: any = {
      id: 'id',
    };
    set(validUser, 'services.password.reset', [{ token, address: email }]);
    validUser.emails = [{ address: email }];
    const validUserEnroll: any = {
      id: 'id',
    };
    validUserEnroll.emails = [{ address: email }];
    set(validUserEnroll, 'services.password.reset', [{ token, address: email, reason: 'enroll' }]);
    const invalidUser = { ...validUser };
    invalidUser.emails = [];

    it('throws on invalid token', async () => {
      await expect(password.resetPassword('', '', connectionInfo)).rejects.toThrow('Invalid token');
    });

    it('throws on invalid password', async () => {
      await expect(password.resetPassword(token, '', connectionInfo)).rejects.toThrow(
        'Invalid new password'
      );
    });

    it('throws when token not found', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByResetPasswordToken } as any);
      password.setSessionsStore();
      await expect(password.resetPassword(token, newPassword, connectionInfo)).rejects.toThrow(
        'Reset password link expired'
      );
    });

    it('throws when token is expired', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(invalidUser));
      password.isTokenExpired = jest.fn(() => true);
      password.setUserStore({ findUserByResetPasswordToken } as any);
      password.setSessionsStore();
      await expect(password.resetPassword(token, newPassword, connectionInfo)).rejects.toThrow(
        'Reset password link expired'
      );
    });

    it('throws when token have invalid email', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(invalidUser));
      password.isTokenExpired = jest.fn(() => false);
      password.setUserStore({ findUserByResetPasswordToken } as any);
      password.setSessionsStore();
      await expect(password.resetPassword(token, newPassword, connectionInfo)).rejects.toThrow(
        'Reset password link is for unknown address'
      );
    });

    it('validate user email if enrolled', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(validUserEnroll));
      password.isTokenExpired = jest.fn(() => false);
      const setPassword = jest.fn(() => Promise.resolve());
      const removeAllResetPasswordTokens = jest.fn(() => Promise.resolve());
      const invalidateAllSessions = jest.fn(() => Promise.resolve());
      const verifyEmail = jest.fn(() => Promise.resolve());
      password.setUserStore({
        findUserByResetPasswordToken,
        setPassword,
        removeAllResetPasswordTokens,
        invalidateAllSessions,
        verifyEmail,
      } as any);
      password.setSessionsStore();
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      password.server = {
        ...server,
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.resetPassword(token, newPassword, connectionInfo);
      expect(setPassword.mock.calls.length).toBe(1);
      expect(removeAllResetPasswordTokens.mock.calls.length).toBe(1);
      expect(verifyEmail.mock.calls.length).toBe(1);
      expect(invalidateAllSessions.mock.calls[0]).toMatchSnapshot();
    });

    it('reset password and invalidate all sessions', async () => {
      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(validUser));
      const isTokenExpired = jest.fn(() => false);
      const setPassword = jest.fn(() => Promise.resolve());
      const removeAllResetPasswordTokens = jest.fn(() => Promise.resolve());
      const invalidateAllSessions = jest.fn(() => Promise.resolve());
      password.setUserStore({
        findUserByResetPasswordToken,
        setPassword,
        removeAllResetPasswordTokens,
        invalidateAllSessions,
      } as any);
      password.setSessionsStore();
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      password.server = {
        ...server,
        isTokenExpired,
        loginWithUser: jest.fn(),
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      const loginResult = await password.resetPassword(token, newPassword, connectionInfo);
      expect(loginResult).toBeNull();
      expect(setPassword.mock.calls.length).toBe(1);
      expect(removeAllResetPasswordTokens.mock.calls.length).toBe(1);
      expect(invalidateAllSessions.mock.calls[0]).toMatchSnapshot();
    });

    it('reset password and return tokens', async () => {
      const tmpAccountsPassword = new AccountsPassword({
        returnTokensAfterResetPassword: true,
      });

      const findUserByResetPasswordToken = jest.fn(() => Promise.resolve(validUser));
      const isTokenExpired = jest.fn(() => false);
      const exampleLoginResult = {
        sessionId: 'sessionIdValue',
        tokens: {
          refreshToken: 'refreshTokenValue',
          accessToken: 'accessTokenValue',
        },
      };
      const loginWithUser = jest.fn(() => Promise.resolve(exampleLoginResult));
      const setPassword = jest.fn(() => Promise.resolve());
      const removeAllResetPasswordTokens = jest.fn(() => Promise.resolve());
      const invalidateAllSessions = jest.fn(() => Promise.resolve());
      tmpAccountsPassword.setUserStore({
        findUserByResetPasswordToken,
        setPassword,
        removeAllResetPasswordTokens,
        invalidateAllSessions,
      } as any);
      tmpAccountsPassword.setSessionsStore();
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      tmpAccountsPassword.server = {
        ...server,
        isTokenExpired,
        loginWithUser,
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(tmpAccountsPassword.server, 'options.emailTemplates', {});
      const loginResult = await tmpAccountsPassword.resetPassword(
        token,
        newPassword,
        connectionInfo
      );
      expect(loginResult).toEqual(exampleLoginResult);
      expect(setPassword.mock.calls.length).toBe(1);
      expect(removeAllResetPasswordTokens.mock.calls.length).toBe(1);
      expect(invalidateAllSessions.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('setPassword', () => {
    it('call this.db.setPassword', async () => {
      const userId = 'id';
      const setPassword = jest.fn(() => Promise.resolve('user'));
      password.setUserStore({ setPassword } as any);
      password.setSessionsStore();
      const user = await password.setPassword(userId, 'new-password');
      expect(setPassword).toHaveBeenCalledWith(userId, expect.any(String));
      expect(user).toEqual('user');
    });
  });

  describe('changePassword, invalidate all sessions and remove all reset password tokens from user storage', () => {
    const tmpAccountsPassword = new AccountsPassword({
      invalidateAllSessionsAfterPasswordChanged: true,
    });
    const validUser = {
      emails: [{ address: 'john.doe@gmail.com', verified: true }],
    };

    it('throws when new password is invalid', async () => {
      await expect(
        tmpAccountsPassword.changePassword('userId', 'old-password', null as any)
      ).rejects.toThrow('Invalid password');
    });

    it('call invalidateAllSessions', async () => {
      const userId = 'id';
      const setPassword = jest.fn(() => Promise.resolve('user'));
      const findUserById = jest.fn(() => Promise.resolve(validUser));
      const invalidateAllSessions = jest.fn(() => Promise.resolve());
      const findPasswordHash = jest.fn(() => Promise.resolve());
      const removeAllResetPasswordTokens = jest.fn(() => Promise.resolve());
      tmpAccountsPassword.setUserStore({
        setPassword,
        findUserById,
        findPasswordHash,
        invalidateAllSessions,
        removeAllResetPasswordTokens,
      } as any);
      tmpAccountsPassword.setSessionsStore();
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      tmpAccountsPassword.server = {
        ...server,
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(tmpAccountsPassword.server, 'options.emailTemplates', {});
      jest
        .spyOn(tmpAccountsPassword, 'passwordAuthenticator' as any)
        .mockImplementation(() => Promise.resolve(validUser));
      await tmpAccountsPassword.changePassword(userId, 'old-password', 'new-password');
      expect(invalidateAllSessions.mock.calls[0]).toMatchSnapshot();
      (tmpAccountsPassword as any).passwordAuthenticator.mockRestore();
    });

    it('call removeAllResetPasswordTokens', async () => {
      const userId = 'id';
      const setPassword = jest.fn(() => Promise.resolve('user'));
      const findUserById = jest.fn(() => Promise.resolve(validUser));
      const invalidateAllSessions = jest.fn(() => Promise.resolve());
      const findPasswordHash = jest.fn(() => Promise.resolve());
      const removeAllResetPasswordTokens = jest.fn(() => Promise.resolve());
      tmpAccountsPassword.setUserStore({
        setPassword,
        findUserById,
        findPasswordHash,
        invalidateAllSessions,
        removeAllResetPasswordTokens,
      } as any);
      tmpAccountsPassword.setSessionsStore();
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      tmpAccountsPassword.server = {
        ...server,
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(tmpAccountsPassword.server, 'options.emailTemplates', {});
      jest
        .spyOn(tmpAccountsPassword, 'passwordAuthenticator' as any)
        .mockImplementation(() => Promise.resolve(validUser));
      await tmpAccountsPassword.changePassword(userId, 'old-password', 'new-password');
      expect(removeAllResetPasswordTokens.mock.calls[0]).toMatchSnapshot();
      (tmpAccountsPassword as any).passwordAuthenticator.mockRestore();
    });

    it('call passwordAuthenticator and this.db.setPassword', async () => {
      const userId = 'id';
      const setPassword = jest.fn(() => Promise.resolve('user'));
      const findUserById = jest.fn(() => Promise.resolve(validUser));
      const removeAllResetPasswordTokens = jest.fn(() => Promise.resolve());
      password.setUserStore({ setPassword, findUserById, removeAllResetPasswordTokens } as any);
      password.setSessionsStore();
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());

      password.server = {
        ...server,
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      const passwordAuthenticator = jest
        .spyOn(password, 'passwordAuthenticator' as any)
        .mockImplementation(() => Promise.resolve(validUser));
      await password.changePassword(userId, 'old-password', 'new-password');
      expect(passwordAuthenticator.mock.calls[0][0]).toEqual({ id: userId });
      expect(passwordAuthenticator.mock.calls[0][1]).toEqual('old-password');
      expect(setPassword).toHaveBeenCalledWith(userId, expect.any(String));
      expect(prepareMail.mock.calls[0].length).toBe(6);
      expect(sendMail.mock.calls[0].length).toBe(1);
      (password as any).passwordAuthenticator.mockRestore();
    });
  });

  describe('sendVerificationEmail', () => {
    const unverifiedEmail = 'john.doe@gmail.com';
    const verifiedEmail = 'john.doe2@gmail.com';
    const validUser = {
      emails: [
        { address: unverifiedEmail, verified: false },
        { address: verifiedEmail, verified: true },
      ],
    };

    it('throws if email is empty', async () => {
      await expect(password.sendVerificationEmail('')).rejects.toThrow('Invalid email');
    });

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail } as any);
      password.setSessionsStore();
      await expect(password.sendVerificationEmail(unverifiedEmail)).rejects.toThrow(
        'User not found'
      );
    });

    it('should not send email if email is already verified', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addEmailVerificationToken = jest.fn(() => Promise.resolve());
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail, addEmailVerificationToken } as any);
      password.setSessionsStore();
      password.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendVerificationEmail(verifiedEmail);
      expect(addEmailVerificationToken).not.toHaveBeenCalled();
    });

    it('send email to first unverified email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addEmailVerificationToken = jest.fn(() => Promise.resolve());
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail, addEmailVerificationToken } as any);
      password.setSessionsStore();
      password.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendVerificationEmail(unverifiedEmail);
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
      password.setUserStore({ findUserByEmail, addEmailVerificationToken } as any);
      password.setSessionsStore();
      password.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendVerificationEmail(unverifiedEmail);
      expect(addEmailVerificationToken.mock.calls[0].length).toBe(3);
      expect(prepareMail.mock.calls[0].length).toBe(6);
      expect(sendMail.mock.calls[0].length).toBe(1);
    });
  });

  describe('sendResetPasswordEmail', () => {
    const email = 'john.doe@gmail.com';
    const validUser = { emails: [{ address: email }] };

    it('throws if email is empty', async () => {
      await expect(password.sendResetPasswordEmail('')).rejects.toThrow('Invalid email');
    });

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail } as any);
      password.setSessionsStore();
      await expect(password.sendResetPasswordEmail(email)).rejects.toThrow('User not found');
    });

    it('send email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addResetPasswordToken = jest.fn(() => Promise.resolve());
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      const getFirstUserEmail = jest.fn(() => Promise.resolve(email));
      password.setUserStore({ findUserByEmail, addResetPasswordToken } as any);
      password.setSessionsStore();
      password.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
        getFirstUserEmail,
      } as any;
      set(password.server, 'options.emailTemplates', {});
      await password.sendResetPasswordEmail(email);
      expect(addResetPasswordToken.mock.calls[0].length).toBe(4);
      expect(prepareMail.mock.calls[0].length).toBe(6);
      expect(sendMail.mock.calls[0].length).toBe(1);
    });
  });

  describe('sendEnrollmentEmail', () => {
    const email = 'john.doe@gmail.com';
    const validUser = { emails: [{ address: email }] };

    it('throws if email is empty', async () => {
      await expect(password.sendEnrollmentEmail('')).rejects.toThrow('Invalid email');
    });

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail } as any);
      password.setSessionsStore();
      await expect(password.sendEnrollmentEmail(email)).rejects.toThrow('User not found');
    });

    it('send email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addResetPasswordToken = jest.fn(() => Promise.resolve());
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      const getFirstUserEmail = jest.fn(() => Promise.resolve(email));
      password.setUserStore({ findUserByEmail, addResetPasswordToken } as any);
      password.setSessionsStore();
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

  describe('createUser', () => {
    it('throws on required fields', async () => {
      await expect(
        password.createUser({
          password: '123456',
          username: '',
          email: '',
        })
      ).rejects.toThrow('Username or Email is required');
    });

    it('throws when username already exists', async () => {
      const findUserByUsername = jest.fn(() => Promise.resolve('user'));
      password.setUserStore({ findUserByUsername } as any);
      password.setSessionsStore();
      await expect(
        password.createUser({
          password: '123456',
          username: 'user1',
        })
      ).rejects.toThrow('Username already exists');
    });

    it('throws when email already exists', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve('user'));
      password.setUserStore({ findUserByEmail } as any);
      password.setSessionsStore();
      await expect(
        password.createUser({
          password: '123456',
          email: 'email1@email.com',
        })
      ).rejects.toThrow('Email already exists');
    });

    it('validateNewUser allow more fields', async () => {
      const tmpAccountsPassword = new AccountsPassword({
        validateNewUser: (user) => {
          user.additionalField = 'test';
          return user;
        },
      });
      tmpAccountsPassword.server = server;
      const findUserByEmail = jest.fn(() => Promise.resolve());
      const findUserById = jest.fn(() => Promise.resolve());
      const createUser = jest.fn(() => Promise.resolve());
      tmpAccountsPassword.setUserStore({ findUserByEmail, findUserById, createUser } as any);
      tmpAccountsPassword.setSessionsStore();
      await tmpAccountsPassword.createUser({
        password: '123456',
        email: 'email1@email.com',
      });
      expect(findUserByEmail.mock.calls.length).toBe(1);
      expect(createUser).toHaveBeenCalledWith({
        email: 'email1@email.com',
        password: expect.any(String),
        additionalField: 'test',
      });
    });

    it('create user should only allow some fields', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      const findUserById = jest.fn(() => Promise.resolve());
      const createUser = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail, findUserById, createUser } as any);
      password.setSessionsStore();
      await password.createUser({
        password: '123456',
        email: 'email1@email.com',
        additionalField: 'not allowed',
      });
      expect(findUserByEmail.mock.calls.length).toBe(1);
      expect(createUser).toHaveBeenCalledWith({
        email: 'email1@email.com',
        password: expect.any(String),
      });
    });

    it('create user', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      const findUserById = jest.fn(() => Promise.resolve());
      const createUser = jest.fn(() => Promise.resolve());
      password.setUserStore({ findUserByEmail, createUser, findUserById } as any);
      password.setSessionsStore();
      await password.createUser({
        password: '123456',
        email: 'email1@email.com',
      });
      expect(findUserByEmail.mock.calls.length).toBe(1);
      expect(createUser.mock.calls.length).toBe(1);
    });
  });
});
