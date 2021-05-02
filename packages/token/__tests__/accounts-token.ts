import set from 'lodash.set';
import { AccountsToken } from '../src';

describe('AccountsToken', () => {
  const server: any = {
    options: {},
    getHooks: () => ({
      emit: jest.fn(),
    }),
    loginWithUser: jest.fn(),
  };
  const token = new AccountsToken({});
  token.server = server;

  const validUser: any = {
    id: 'id',
    services: {
      token: {
        loginTokens: [{ token: 'toto' }],
      },
    },
  };

  afterEach(() => {
    token.server = server;
    jest.clearAllMocks();
  });

  describe('config', () => {
    it('should have default options', async () => {
      expect((token as any).options.loginTokenExpiration).toBe(900000);
    });
  });

  describe('authenticate', () => {
    it('throws on invalid params', async () => {
      await expect(token.authenticate({} as any)).rejects.toThrowError(
        'Unrecognized options for login request'
      );
    });

    it('throws on invalid type params', async () => {
      await expect(token.authenticate({ user: 'toto', token: 3 } as any)).rejects.toThrowError(
        'Match failed'
      );
    });

    it('return user', async () => {
      const user = {
        services: {},
      };
      const tmpAccountsToken = new AccountsToken({});
      (tmpAccountsToken as any).tokenAuthenticator = jest.fn(() => Promise.resolve(user));
      const ret = await tmpAccountsToken.authenticate({
        user: 'toto',
        token: 'toto',
      } as any);
      expect(ret).toEqual(user);
    });

    it('throws when user not found', async () => {
      const findUserByLoginToken = jest.fn(() => Promise.resolve());
      token.setStore({ findUserByLoginToken } as any);
      await expect(
        token.authenticate({
          user: 'toto@toto.com',
          token: 'toto',
        } as any)
      ).rejects.toThrowError('User not found');
    });

    it('throws on incorrect token', async () => {
      const findUserByLoginToken = jest.fn(() => Promise.resolve({ id: 'id' }));
      token.setStore({ findUserByLoginToken } as any);
      await expect(
        token.authenticate({
          user: 'toto@toto.com',
          token: 'toto',
        } as any)
      ).rejects.toThrowError('Incorrect token');
    });

    it('throws when token is expired', async () => {
      const findUserByLoginToken = jest.fn(() => Promise.resolve(validUser));
      token.isTokenExpired = jest.fn(() => true);
      token.setStore({ findUserByLoginToken } as any);
      await expect(
        token.authenticate({
          user: 'toto@toto.com',
          token: 'toto',
        } as any)
      ).rejects.toThrowError('Login token expired');
    });
  });

  describe('requestLoginToken', () => {
    const verifiedEmail = 'john.doe@gmail.com';
    const unverifiedEmail = 'john.doe2@gmail.com';
    const validUser = {
      emails: [
        { address: unverifiedEmail, verified: false },
        { address: verifiedEmail, verified: true },
      ],
    };

    it('throws if email is empty', async () => {
      await expect(token.requestLoginToken('')).rejects.toThrowError('Invalid email');
    });

    it('throws if user is not found', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve());
      token.setStore({ findUserByEmail } as any);
      await expect(token.requestLoginToken(unverifiedEmail)).rejects.toThrowError('User not found');
    });

    it('send email', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve(validUser));
      const addLoginToken = jest.fn(() => Promise.resolve());
      const prepareMail = jest.fn(() => Promise.resolve());
      const sanitizeUser = jest.fn(() => Promise.resolve());
      const sendMail = jest.fn(() => Promise.resolve());
      token.setStore({ findUserByEmail, addLoginToken } as any);
      token.server = {
        prepareMail,
        options: { sendMail },
        sanitizeUser,
      } as any;
      set(token.server, 'options.emailTemplates', {});
      await token.requestLoginToken(verifiedEmail);
      expect(addLoginToken.mock.calls[0].length).toBe(4);
      expect(prepareMail.mock.calls[0].length).toBe(6);
      expect(sendMail.mock.calls[0].length).toBe(1);
    });
  });
});
