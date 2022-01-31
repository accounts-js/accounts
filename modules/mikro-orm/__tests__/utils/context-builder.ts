import { context } from '../../src/utils/context-builder';

describe('context-builder', () => {
  const user = { id: 'idTest' };
  const accountsServerMock = {
    resumeSession: jest.fn<any, any>(() => user),
  };
  const authToken = 'authTokenTest';
  const ip = '0.0.0.0';
  const reqMock = {
    headers: {
      'x-client-ip': ip,
      Authorization: 'Bearer ' + authToken,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not resume session is header is empty', async () => {
    accountsServerMock.resumeSession.mockRejectedValueOnce(true);
    await context({ req: { headers: {} } } as any, { accountsServer: accountsServerMock } as any);
    expect(accountsServerMock.resumeSession).not.toHaveBeenCalled();
  });

  it('should resume session and inject the user', async () => {
    accountsServerMock.resumeSession.mockRejectedValueOnce(true);
    const data = await context(
      { req: reqMock } as any,
      { accountsServer: accountsServerMock } as any
    );
    expect(accountsServerMock.resumeSession).toHaveBeenCalledWith(authToken);
    expect(data.authToken).toBe(authToken);
    expect(data.ip).toBe(ip);
  });

  it('should allow no request in context', async () => {
    const data = await context({} as any, { accountsServer: accountsServerMock } as any);
    expect(data.ip).toBe('');
    expect(data.userAgent).toBe('');
    expect(accountsServerMock.resumeSession).not.toHaveBeenCalled();
  });
});
