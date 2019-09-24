import { AccountsServer } from '@accounts/server';
import { Mutation } from '../../../../src/modules/accounts/resolvers/mutation';

describe('accounts resolvers mutation', () => {
  const accountsServerMock = {
    options: {},
    loginWithService: jest.fn(),
    authenticateWithService: jest.fn(),
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
      expect(injector.get).toHaveBeenCalledWith(AccountsServer);
      expect(accountsServerMock.loginWithService).toHaveBeenCalledWith(serviceName, params, {
        ip,
        userAgent,
      });
    });

    it('should call authenticateWithService', async () => {
      await Mutation.verifyAuthentication!(
        {},
        { serviceName, params } as any,
        { injector, ip, userAgent } as any,
        {} as any
      );
      expect(injector.get).toHaveBeenCalledWith(AccountsServer);
      expect(accountsServerMock.authenticateWithService).toHaveBeenCalledWith(serviceName, params, {
        ip,
        userAgent,
      });
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
      expect(injector.get).toHaveBeenCalledWith(AccountsServer);
      expect(accountsServerMock.impersonate).toHaveBeenCalledWith(
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
      expect(injector.get).not.toHaveBeenCalledWith(AccountsServer);
      expect(accountsServerMock.logout).not.toHaveBeenCalled();
    });

    it('should call logout', async () => {
      await Mutation.logout!({}, {}, { injector, authToken } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsServer);
      expect(accountsServerMock.logout).toHaveBeenCalledWith(authToken);
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
      expect(injector.get).toHaveBeenCalledWith(AccountsServer);
      expect(accountsServerMock.refreshTokens).toHaveBeenCalledWith(
        accessToken,
        refreshToken,
        ip,
        userAgent
      );
    });
  });
});
