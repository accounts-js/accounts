import fetch from 'node-fetch';
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
      refreshSession: jest.fn(() => Promise.resolve()),
      tokens: jest.fn(() => Promise.resolve({})),
    };
    await authFetch(accounts, 'path', {});
    expect(accounts.refreshSession).toBeCalled();
    expect(accounts.tokens).toBeCalled();
  });

  it('should set access token header', async () => {
    const accounts = {
      refreshSession: jest.fn(() => Promise.resolve()),
      tokens: jest.fn(() => Promise.resolve({ accessToken: 'accessToken' })),
    };
    await authFetch(accounts, 'path', {});
    expect(accounts.refreshSession).toBeCalled();
    expect(accounts.tokens).toBeCalled();
    expect(window.fetch.mock.calls[0][1].headers['accounts-access-token']).toBe(
      'accessToken'
    );
  });

  it('should pass other headers', async () => {
    const accounts = {
      refreshSession: jest.fn(() => Promise.resolve()),
      tokens: jest.fn(() => Promise.resolve({ accessToken: 'accessToken' })),
    };
    await authFetch(accounts, 'path', {
      headers: {
        toto: 'toto',
      },
    });
    expect(accounts.refreshSession).toBeCalled();
    expect(accounts.tokens).toBeCalled();
    expect(window.fetch.mock.calls[0][1].headers.toto).toBe('toto');
  });
});
