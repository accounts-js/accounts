import { authFetch } from '../src/auth-fetch';

window.fetch = jest.fn().mockImplementation(() => ({
  status: 200,
  json: jest.fn().mockImplementation(() => ({ test: 'test' })),
}));

describe('authFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetch', async () => {
    const accounts = {
      refreshSession: jest.fn(() => Promise.resolve({})),
    };
    await authFetch(accounts as any, 'path', {});
    expect(accounts.refreshSession).toHaveBeenCalled();
  });

  it('should set access token header', async () => {
    const accounts = {
      refreshSession: jest.fn(() => Promise.resolve({ accessToken: 'accessToken' })),
    };
    await authFetch(accounts as any, 'path', {});
    expect(accounts.refreshSession).toHaveBeenCalled();
    expect((window.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe(
      'Bearer accessToken'
    );
  });

  it('should pass other headers', async () => {
    const accounts = {
      refreshSession: jest.fn(() => Promise.resolve({ accessToken: 'accessToken' })),
    };
    await authFetch(accounts as any, 'path', {
      headers: {
        toto: 'toto',
      },
    });
    expect(accounts.refreshSession).toHaveBeenCalled();
    expect((window.fetch as jest.Mock).mock.calls[0][1].headers.toto).toBe('toto');
  });
});
