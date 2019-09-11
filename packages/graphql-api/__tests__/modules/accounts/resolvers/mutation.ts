import { AccountsServer } from '@accounts/server';
import { Mutation } from '../../../../src/modules/accounts/resolvers/mutation';

describe('accounts resolvers mutation', () => {
  const accountsServerMock = {
    options: {},
    performMfaChallenge: jest.fn(),
    loginWithService: jest.fn(),
    impersonate: jest.fn(),
    logout: jest.fn(),
    refreshTokens: jest.fn(),
  };
  const injector = {
    get: jest.fn(() => accountsServerMock),
  };
  const authToken = 'authTokenTest';
  const ip = 'ipTest';
  const userAgent = 'userAgentTest';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    const serviceName = 'serviceNameTest';
    const params = 'paramsTest';

    it('should call loginWithService', async () => {
      await Mutation.authenticate!(
        {},
        { serviceName, params } as any,
        { injector, ip, userAgent } as any,
        {} as any
      );
      expect(injector.get).toBeCalledWith(AccountsServer);
      expect(accountsServerMock.loginWithService).toBeCalledWith(serviceName, params, {
        ip,
        userAgent,
      });
    });
  });

  describe('performMfaChallenge', () => {
    const challenge = 'sms';
    const mfaToken = 'mfa-token';
    const params = {};

    it('should call performMfaChallenge', async () => {
      await Mutation.performMfaChallenge!(
        {},
        { challenge, mfaToken, params } as any,
        { injector, ip, userAgent } as any,
        {} as any
      );
      expect(injector.get).toBeCalledWith(AccountsServer);
      expect(accountsServerMock.performMfaChallenge).toBeCalledWith(challenge, mfaToken, params);
    });
  });

  describe('impersonate', () => {
    const accessToken = 'accessTokenTest';
    const username = 'usernameTest';

    it('should call impersonate', async () => {
      await Mutation.impersonate!(
        {},
        { accessToken, username } as any,
        { injector, ip, userAgent } as any,
        {} as any
      );
      expect(injector.get).toBeCalledWith(AccountsServer);
      expect(accountsServerMock.impersonate).toBeCalledWith(
        accessToken,
        { username },
        ip,
        userAgent
      );
    });
  });

  describe('logout', () => {
    it('should not call logout if token is not present', async () => {
      await Mutation.logout!({}, {}, { injector } as any, {} as any);
      expect(injector.get).not.toBeCalledWith(AccountsServer);
      expect(accountsServerMock.logout).not.toBeCalled();
    });

    it('should call logout', async () => {
      await Mutation.logout!({}, {}, { injector, authToken } as any, {} as any);
      expect(injector.get).toBeCalledWith(AccountsServer);
      expect(accountsServerMock.logout).toBeCalledWith(authToken);
    });
  });

  describe('refreshTokens', () => {
    const accessToken = 'accessTokenTest';
    const refreshToken = 'refreshTokenTest';

    it('should call refreshTokens', async () => {
      await Mutation.refreshTokens!(
        {},
        { accessToken, refreshToken },
        { injector, ip, userAgent } as any,
        {} as any
      );
      expect(injector.get).toBeCalledWith(AccountsServer);
      expect(accountsServerMock.refreshTokens).toBeCalledWith(
        accessToken,
        refreshToken,
        ip,
        userAgent
      );
    });
  });
});
