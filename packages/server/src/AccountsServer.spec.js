import jwtDecode from 'jwt-decode';
import { AccountsServer } from './AccountsServer';
import { hashPassword } from './encryption';

let Accounts;

describe('Accounts', () => {
  beforeEach(() => {
    Accounts = new AccountsServer();
    Accounts.config({}, {});
  });
  describe('config', () => {
    it('requires a db driver', () => {
      try {
        Accounts.config();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('A database driver is required');
      }
    });

    it('sets the db driver', () => {
      const db = {};
      Accounts.config({}, db);
      expect(Accounts.db).toEqual(db);
    });

    it('set custom password authenticator', () => {
      const db = {};
      Accounts.config({ passwordAuthenticator: () => {} }, db);
      expect(Accounts._options.passwordAuthenticator).toBeDefined();
    });

    it('use default password authenticator', () => {
      const db = {};
      Accounts.config({}, db);
      expect(Accounts._options.passwordAuthenticator).toBeUndefined();
    });
  });

  describe('options', () => {
    it('should return options', () => {
      Accounts.config({ config: 'config' }, {});
      const options = Accounts.options();
      expect(options.config).toEqual('config');
    });
  });

  const db = {
    findUserByUsername: () => Promise.resolve(),
    findUserByEmail: () => Promise.resolve(),
    createUser: () => Promise.resolve(),
    createSession: () => Promise.resolve(),
  };
  describe('createUser', () => {
    beforeEach(() => {
      Accounts.config({}, db);
    });
    it('requires username or an email', async () => {
      Accounts.config({}, db);
      try {
        await Accounts.createUser({
          password: '123456',
          username: '',
          email: '',
        });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Username or Email is required');
      }
    });
    it('throws error if username exists', async () => {
      Accounts.config({}, {
        ...db,
        findUserByUsername: () => Promise.resolve('user'),
      });
      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user1',
          email: '',
        });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Username already exists');
      }
    });
    it('throws error if email exists', async () => {
      Accounts.config({}, {
        ...db,
        findUserByEmail: () => Promise.resolve('user'),
      });
      try {
        await Accounts.createUser({
          password: '123456',
          username: '',
          email: 'email1@email.com',
        });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Email already exists');
      }
    });
    it('succesfully create a user', async () => {
      Accounts.config({}, {
        ...db,
        createUser: () => Promise.resolve('123'),
      });
      const userId = await Accounts.createUser({
        password: '123456',
        username: 'user1',
      });
      expect(userId).toEqual('123');
    });
  });
  describe('loginWithPassword - errors', () => {
    it('throws error if user is undefined', async () => {
      try {
        await Accounts.loginWithPassword(null, '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });
    it('throws error if password is undefined', async () => {
      try {
        await Accounts.loginWithPassword('username', null);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });
    it('throws error if user is not a string or an object', async () => {
      try {
        await Accounts.loginWithPassword(1, '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Match failed');
      }
    });
    it('throws error if password is not a string', async () => {
      try {
        await Accounts.loginWithPassword('username', {});
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Match failed');
      }
    });
    it('throws error if user is not found', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve(null),
        findUserByEmail: () => Promise.resolve(null),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('User not found');
      }
    });
    it('throws error if password not set', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve('123'),
        findUserByEmail: () => Promise.resolve(null),
        findPasswordHash: () => Promise.resolve(null),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('User has no password set');
      }
    });
    it('throws error if password is incorrect', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve('123'),
        findUserByEmail: () => Promise.resolve(null),
        findPasswordHash: () => Promise.resolve('hash'),
        verifyPassword: () => Promise.resolve(false),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Incorrect password');
      }
    });
    it('should use custom password authenticator when specified', async () => {
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        profile: {
          bio: 'bio',
        },
      };
      const authenticator = jest.fn(() => Promise.resolve(user));

      Accounts.config({ passwordAuthenticator: authenticator }, db);

      const result = await Accounts.loginWithPassword('username', '123456');

      expect(result).toBeDefined();
      expect(authenticator.mock.calls.length).toEqual(1);
    });
    describe('loginWithUser', () => {
      it('login using id', async () => {
        const hash = hashPassword('1234567');
        const user = {
          id: '123',
          username: 'username',
          email: 'email@email.com',
          profile: {
            bio: 'bio',
          },
        };
        const findUserById = jest.fn(() => Promise.resolve(user));
        Accounts.config({}, {
          findUserById,
          findPasswordHash: () => Promise.resolve(hash),
          createSession: () => Promise.resolve('sessionId'),
        });
        const res = await Accounts.loginWithPassword({ id: '123' }, '1234567');
        expect(findUserById.mock.calls[0][0]).toEqual('123');
        expect(res.user).toEqual(user);
        const { accessToken, refreshToken } = res.tokens;
        const decodedAccessToken = jwtDecode(accessToken);
        expect(decodedAccessToken.data.sessionId).toEqual('sessionId');
        expect(accessToken).toBeTruthy();
        expect(refreshToken).toBeTruthy();
      });
    });
    describe('refreshTokens', () => {
      it('updates session and returns new tokens and user', async () => {
        const updateSession = jest.fn(() => Promise.resolve());
        const user = {
          userId: '123',
          username: 'username',
        };
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            sessionId: '456',
            valid: true,
            userId: '123',
          }),
          findUserById: () => Promise.resolve(user),
          updateSession,
        });
        const { accessToken, refreshToken } = Accounts.createTokens('456');
        Accounts.createTokens = () => ({
          accessToken: 'newAccessToken',
          refreshToken: 'newRefreshToken',
        });
        const res = await Accounts.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
        expect(updateSession.mock.calls[0]).toEqual([
          '456',
          'ip',
          'user agent',
        ]);
        expect(res.user).toEqual({
          userId: '123',
          username: 'username',
        });
      });

      it('requires access and refresh tokens', async () => {
        Accounts.config({}, {});
        try {
          await Accounts.refreshTokens();
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('An accessToken and refreshToken are required');
        }
      });
      it('throws error if tokens are not valid', async () => {
        Accounts.config({}, {});
        try {
          await Accounts.refreshTokens('bad access token', 'bad refresh token');
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('Tokens are not valid');
        }
      });
      it('throws error if session not found', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve(null),
        });
        try {
          const { accessToken, refreshToken } = Accounts.createTokens();
          await Accounts.refreshTokens(accessToken, refreshToken);
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('Session not found');
        }
      });
      it('throws error if session not valid', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            valid: false,
          }),
        });
        try {
          const { accessToken, refreshToken } = Accounts.createTokens();
          await Accounts.refreshTokens(accessToken, refreshToken);
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('Session is no longer valid');
        }
      });
    });
    describe('logout', () => {
      it('throws error if user is not found', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            sessionId: '456',
            valid: true,
            userId: '123',
          }),
          findUserById: () => Promise.resolve(null),
        });
        try {
          const { accessToken } = Accounts.createTokens('456');
          await Accounts.logout(accessToken);
          throw new Error();
        } catch (err) {
          const { message } = err;
          expect(message).toEqual('User not found');
        }
      });

      it('invalidates session', async () => {
        const invalidateSession = jest.fn(() => Promise.resolve());
        const user = {
          userId: '123',
          username: 'username',
        };
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            sessionId: '456',
            valid: true,
            userId: '123',
          }),
          findUserById: () => Promise.resolve(user),
          invalidateSession,
        });
        const { accessToken } = Accounts.createTokens('456');
        await Accounts.logout(accessToken);
        expect(invalidateSession.mock.calls[0]).toEqual([
          '456',
        ]);
      });
    });
    describe('findSessionByAccessToken', () => {
      it('requires access token', async () => {
        Accounts.config({}, {});
        try {
          await Accounts.logout();
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('An accessToken is required');
        }
      });
      it('throws error if tokens are not valid', async () => {
        Accounts.config({}, {});
        try {
          await Accounts.logout('bad access token');
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('Tokens are not valid');
        }
      });
      it('throws error if session not found', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve(null),
        });
        try {
          const { accessToken } = Accounts.createTokens();
          await Accounts.logout(accessToken);
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('Session not found');
        }
      });
      it('throws error if session not valid', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            valid: false,
          }),
        });
        try {
          const { accessToken } = Accounts.createTokens();
          await Accounts.logout(accessToken);
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('Session is no longer valid');
        }
      });
    });

    describe('findUserByEmail', () => {
      it('call this.db.findUserByEmail', async () => {
        const findUserByEmail = jest.fn(() => Promise.resolve('user'));
        Accounts.config({}, { findUserByEmail });
        const user = await Accounts.findUserByEmail('email');
        expect(findUserByEmail.mock.calls[0]).toEqual(['email']);
        expect(user).toEqual('user');
      });
    });

    describe('findUserByUsername', () => {
      it('call this.db.findUserByUsername', async () => {
        const findUserByUsername = jest.fn(() => Promise.resolve('user'));
        Accounts.config({}, { findUserByUsername });
        const user = await Accounts.findUserByUsername('username');
        expect(findUserByUsername.mock.calls[0]).toEqual(['username']);
        expect(user).toEqual('user');
      });
    });

    describe('findUserById', () => {
      it('call this.db.findUserById', async () => {
        const findUserById = jest.fn(() => Promise.resolve('user'));
        Accounts.config({}, { findUserById });
        const user = await Accounts.findUserById('id');
        expect(findUserById.mock.calls[0]).toEqual(['id']);
        expect(user).toEqual('user');
      });
    });

    describe('addEmail', () => {
      it('call this.db.addEmail', async () => {
        const addEmail = jest.fn(() => Promise.resolve());
        Accounts.config({}, { addEmail });
        await Accounts.addEmail('id', 'email', true);
        expect(addEmail.mock.calls[0]).toEqual(['id', 'email', true]);
      });
    });

    describe('removeEmail', () => {
      it('call this.db.removeEmail', async () => {
        const removeEmail = jest.fn(() => Promise.resolve());
        Accounts.config({}, { removeEmail });
        await Accounts.removeEmail('id', 'email');
        expect(removeEmail.mock.calls[0]).toEqual(['id', 'email']);
      });
    });

    describe('resumeSession', () => {
      it('throws error if user is not found', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            sessionId: '456',
            valid: true,
            userId: '123',
          }),
          findUserById: () => Promise.resolve(null),
        });
        try {
          const { accessToken } = Accounts.createTokens('456');
          await Accounts.resumeSession(accessToken);
          throw new Error();
        } catch (err) {
          const { message } = err;
          expect(message).toEqual('User not found');
        }
      });

      it('return false if session is not valid', async () => {
        const user = {
          userId: '123',
          username: 'username',
        };
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            sessionId: '456',
            valid: false,
            userId: '123',
          }),
          findUserById: () => Promise.resolve(user),
        });
        const { accessToken } = Accounts.createTokens('456');
        const ret = await Accounts.resumeSession(accessToken);
        expect(ret).not.toBeTruthy();
      });

      it('return user', async () => {
        const user = {
          userId: '123',
          username: 'username',
        };
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            sessionId: '456',
            valid: true,
            userId: '123',
          }),
          findUserById: () => Promise.resolve(user),
        });
        const { accessToken } = Accounts.createTokens('456');
        const foundUser = await Accounts.resumeSession(accessToken);
        expect(foundUser).toEqual(user);
      });
    });

    it('return user with custom validation method', async () => {
      const resumeSessionValidator = jest.fn(() => Promise.resolve({}));

      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config({ resumeSessionValidator }, {
        findSessionById: () => Promise.resolve({
          sessionId: '456',
          valid: true,
          userId: '123',
        }),
        findUserById: () => Promise.resolve(user),
      });

      const { accessToken } = Accounts.createTokens('456');
      await Accounts.resumeSession(accessToken);

      expect(resumeSessionValidator.mock.calls.length).toBe(1);
    });

    it('throw when custom validation method rejects', async () => {
      const resumeSessionValidator = jest.fn(() => Promise.reject('Custom session error'));

      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config({ resumeSessionValidator }, {
        findSessionById: () => Promise.resolve({
          sessionId: '456',
          valid: true,
          userId: '123',
        }),
        findUserById: () => Promise.resolve(user),
      });

      const { accessToken } = Accounts.createTokens('456');

      try {
        await Accounts.resumeSession(accessToken);
        throw new Error();
      } catch (err) {
        expect(resumeSessionValidator.mock.calls.length).toBe(1);
        expect(err.message).toEqual('Custom session error');
      }
    });

    describe('setProfile', () => {
      it('throws error if user is not found', async () => {
        Accounts.config({}, {
          findUserById: () => Promise.resolve(null),
        });
        try {
          await Accounts.setProfile();
          throw new Error();
        } catch (err) {
          const { message } = err;
          expect(message).toEqual('User not found');
        }
      });

      it('calls set profile on db interface', async () => {
        const user = {
          userId: '123',
          username: 'username',
        };
        const profile = {
          bio: 'bio',
        };
        const setProfile = jest.fn();
        Accounts.config({}, {
          findUserById: () => Promise.resolve(user),
          setProfile,
        });
        await Accounts.setProfile('123', profile);
        expect(setProfile.mock.calls.length).toEqual(1);
        expect(setProfile.mock.calls[0][0]).toEqual('123');
        expect(setProfile.mock.calls[0][1]).toEqual(profile);
      });

      it('merges profile and calls set profile on db interface', async () => {
        const user = {
          userId: '123',
          username: 'username',
          profile: {
            title: 'title',
          },
        };
        const profile = {
          bio: 'bio',
        };
        const mergedProfile = {
          title: 'title',
          bio: 'bio',
        };
        const setProfile = jest.fn(() => mergedProfile);
        Accounts.config({}, {
          findUserById: () => Promise.resolve(user),
          setProfile,
        });
        const res = await Accounts.updateProfile('123', profile);
        expect(setProfile.mock.calls.length).toEqual(1);
        expect(setProfile.mock.calls[0][0]).toEqual('123');
        expect(setProfile.mock.calls[0][1]).toEqual(mergedProfile);
        expect(res).toEqual(mergedProfile);
      });
    });

    describe('sendVerificationEmail', () => {
      it('throws error if user is not found', async () => {
        Accounts.config({}, {
          findUserById: () => Promise.resolve(null),
        });
        try {
          await Accounts.sendVerificationEmail();
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('User not found');
        }
      });

      it('throws when bad email address passed', async () => {
        const user = {
          emails: [{ address: 'email' }],
        };
        Accounts.config({}, {
          findUserById: () => Promise.resolve(user),
        });
        try {
          await Accounts.sendVerificationEmail('userId', 'toto');
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('No such email address for user');
        }
      });

      it('should send to first unverified email', async () => {
        const user = {
          emails: [{ address: 'email' }],
        };
        Accounts.config({}, {
          findUserById: () => Promise.resolve(user),
          addEmailVerificationToken: () => Promise.resolve('token'),
        });
        Accounts.email = { sendMail: jest.fn() };
        await Accounts.sendVerificationEmail('userId');
        expect(Accounts.email.sendMail.mock.calls.length).toEqual(1);
        expect(Accounts.email.sendMail.mock.calls[0][0].from).toBeTruthy();
        expect(Accounts.email.sendMail.mock.calls[0][0].to).toEqual('email');
        expect(Accounts.email.sendMail.mock.calls[0][0].subject).toBeTruthy();
        expect(Accounts.email.sendMail.mock.calls[0][0].text).toBeTruthy();
      });

      it('should send email', async () => {
        const user = {
          emails: [{ address: 'email' }],
        };
        Accounts.config({}, {
          findUserById: () => Promise.resolve(user),
          addEmailVerificationToken: () => Promise.resolve('token'),
        });
        Accounts.email = { sendMail: jest.fn() };
        await Accounts.sendVerificationEmail('userId', 'email');
        expect(Accounts.email.sendMail.mock.calls.length).toEqual(1);
        expect(Accounts.email.sendMail.mock.calls[0][0].from).toBeTruthy();
        expect(Accounts.email.sendMail.mock.calls[0][0].to).toEqual('email');
        expect(Accounts.email.sendMail.mock.calls[0][0].subject).toBeTruthy();
        expect(Accounts.email.sendMail.mock.calls[0][0].text).toBeTruthy();
      });
    });

    describe('sendResetPasswordEmail', () => {
      it('throws error if user is not found', async () => {
        Accounts.config({}, {
          findUserById: () => Promise.resolve(null),
        });
        try {
          await Accounts.sendResetPasswordEmail();
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('User not found');
        }
      });

      it('throws when bad email address passed', async () => {
        const user = {
          emails: [{ address: 'email' }],
        };
        Accounts.config({}, {
          findUserById: () => Promise.resolve(user),
        });
        try {
          await Accounts.sendResetPasswordEmail('userId', 'toto');
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('No such email address for user');
        }
      });

      it('should send to first user email', async () => {
        const user = {
          emails: [{ address: 'email' }],
        };
        Accounts.config({}, {
          findUserById: () => Promise.resolve(user),
          addResetPasswordToken: () => Promise.resolve('token'),
        });
        Accounts.email = { sendMail: jest.fn() };
        await Accounts.sendResetPasswordEmail('userId');
        expect(Accounts.email.sendMail.mock.calls.length).toEqual(1);
        expect(Accounts.email.sendMail.mock.calls[0][0].from).toBeTruthy();
        expect(Accounts.email.sendMail.mock.calls[0][0].to).toEqual('email');
        expect(Accounts.email.sendMail.mock.calls[0][0].subject).toBeTruthy();
        expect(Accounts.email.sendMail.mock.calls[0][0].text).toBeTruthy();
      });

      it('should send email', async () => {
        const user = {
          emails: [{ address: 'email' }],
        };
        Accounts.config({}, {
          findUserById: () => Promise.resolve(user),
          addResetPasswordToken: () => Promise.resolve('token'),
        });
        Accounts.email = { sendMail: jest.fn() };
        await Accounts.sendResetPasswordEmail('userId', 'email');
        expect(Accounts.email.sendMail.mock.calls.length).toEqual(1);
        expect(Accounts.email.sendMail.mock.calls[0][0].from).toBeTruthy();
        expect(Accounts.email.sendMail.mock.calls[0][0].to).toEqual('email');
        expect(Accounts.email.sendMail.mock.calls[0][0].subject).toBeTruthy();
        expect(Accounts.email.sendMail.mock.calls[0][0].text).toBeTruthy();
      });
    });

    describe('sendEnrollmentEmail', () => {
      it('throws error if user not found', async () => {
        Accounts.config({}, {
          findUserById: () => Promise.resolve(null),
        });
        try {
          await Accounts.sendEnrollmentEmail('userId', 'email');
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('User not found');
        }
      });
      it('adds email verification token and sends mail', async () => {
        const addResetPasswordToken = jest.fn();
        const _getFirstUserEmail = jest.fn(() => 'user@user.com');
        const sendMail = jest.fn();
        Accounts.config({
          siteUrl: 'siteUrl',
        }, {
          findUserById: () => Promise.resolve({
            emails: [{
              address: 'user@user.com',
              verified: false,
            }],
          }),
          addResetPasswordToken,
        });
        Accounts._getFirstUserEmail = _getFirstUserEmail;
        Accounts.email.sendMail = sendMail;
        await Accounts.sendEnrollmentEmail('userId');
        expect(addResetPasswordToken.mock.calls[0][0]).toEqual('userId');
        expect(addResetPasswordToken.mock.calls[0][1]).toEqual('user@user.com');
        expect(addResetPasswordToken.mock.calls[0][3]).toEqual('enroll');
        expect(sendMail.mock.calls.length).toEqual(1);
      });
    });
    describe('_getFirstUserEmail', () => {
      it('throws error if email does not exist', () => {
        try {
          Accounts._getFirstUserEmail({
            emails: [{
              address: '',
              verified: false,
            }],
          });
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('No such email address for user');
        }
        try {
          Accounts._getFirstUserEmail({
            emails: [{
              address: 'wrongemail@email.com',
              verified: false,
            }],
          }, 'email');
          throw new Error();
        } catch (err) {
          expect(err.message).toEqual('No such email address for user');
        }
      });
      it('returns first email', () => {
        const email = Accounts._getFirstUserEmail({
          emails: [{
            address: 'email@email.com',
            verified: false,
          },
          {
            address: 'another@email.com',
            verified: false,
          }],
        });
        expect(email).toEqual('email@email.com');
      });
    });
  });
});
