import { AccountsClientToken } from '../src/client-token';

const mockedClient = {
  transport: {
    requestLoginToken: jest.fn(),
  },
  loginWithService: jest.fn(),
};
const accountsToken = new AccountsClientToken(mockedClient as any);

const user = {
  email: 'john@doe.com',
  token: 'deadbeef',
};

describe('AccountsClientPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requires the client', async () => {
    expect(() => new AccountsClientToken(null as any)).toThrowError(
      'A valid client instance is required'
    );
  });

  describe('login', () => {
    it('should call client', async () => {
      await accountsToken.login(user as any);
      expect(mockedClient.loginWithService).toHaveBeenCalledTimes(1);
      expect(mockedClient.loginWithService).toHaveBeenCalledWith('token', {
        email: user.email,
        token: user.token,
      });
    });
  });

  describe('requestLoginToken', () => {
    it('should call transport', async () => {
      await accountsToken.requestLoginToken(user.email);
      expect(mockedClient.transport.requestLoginToken).toHaveBeenCalledWith(user.email);
    });
  });
});
