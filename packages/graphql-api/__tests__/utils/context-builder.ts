import { context } from '../../src/utils/context-builder';

describe('context-builder', () => {
  const user = { id: 'idTest' };
  const accountsServerMock = {
    resumeSession: jest.fn<any, any>(() => user),
  };
  const injector = {
    get: jest.fn(() => ({
      accountsServer: accountsServerMock,
    })),
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
    await context('test')!({ req: { headers: {} } } as any, {}, { injector } as any);
    expect(injector.get).toHaveBeenCalled();
    expect(accountsServerMock.resumeSession).not.toHaveBeenCalled();
  });

  it('should resume session and inject the user', async () => {
    accountsServerMock.resumeSession.mockRejectedValueOnce(true);
    const data = await context('test')!({ req: reqMock } as any, {}, { injector } as any);
    expect(injector.get).toHaveBeenCalled();
    expect(accountsServerMock.resumeSession).toHaveBeenCalledWith(authToken);
    expect(data.authToken).toBe(authToken);
    expect(data.ip).toBe(ip);
  });

  it('should allow no request in context', async () => {
    const data = await context('test')!({} as any, {}, { injector } as any);
    expect(data.ip).toBe('');
    expect(data.userAgent).toBe('');
    expect(injector.get).not.toHaveBeenCalled();
  });
});
