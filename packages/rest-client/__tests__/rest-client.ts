import fetch from 'node-fetch';
import { RestClient } from '../src/rest-client';

window.fetch = jest.fn().mockImplementation(() => ({
  status: 200,
  json: jest.fn().mockImplementation(() => ({ test: 'test' })),
}));

window.Headers = fetch.Headers;

describe('RestClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have a way to configure api host address and root path', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000/',
      rootPath: 'accounts',
    });

    expect(client.options.apiHost).toBe('http://localhost:3000/');
    expect(client.options.rootPath).toBe('accounts');

    return client.fetch('try').then(() => {
      expect(window.fetch.mock.calls[0][0]).toBe(
        'http://localhost:3000/accounts/try'
      );
    });
  });

  describe('fetch', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000/',
      rootPath: 'accounts',
    });

    it('should enable custom headers', () =>
      client
        .fetch('route', {}, { origin: 'localhost:3000' })
        .then(() =>
          expect(window.fetch.mock.calls[0][1].headers.origin).toBe(
            'localhost:3000'
          )
        ));

    it('should throw error', async () => {
      window.fetch = jest.fn().mockImplementation(() => ({
        status: 400,
        json: jest.fn().mockImplementation(() => ({ test: 'test' })),
      }));

      try {
        await client.fetch('route', {}, { origin: 'localhost:3000' });
        throw new Error();
      } catch (err) {
        expect(window.fetch.mock.calls[0][1].headers.origin).toBe(
          'localhost:3000'
        );
      }
      window.fetch = jest.fn().mockImplementation(() => ({
        status: 200,
        json: jest.fn().mockImplementation(() => ({ test: 'test' })),
      }));
    });

    it('should throw if server did not return a response', async () => {
      window.fetch = jest.fn().mockImplementation(() => null);

      try {
        await client.fetch('route', {}, { origin: 'localhost:3000' });
        throw new Error();
      } catch (err) {
        expect(window.fetch.mock.calls[0][1].headers.origin).toBe(
          'localhost:3000'
        );
        expect(err.message).toBe('Server did not return a response');
      }
      window.fetch = jest.fn().mockImplementation(() => ({
        status: 200,
        json: jest.fn().mockImplementation(() => ({ test: 'test' })),
      }));
    });
  });

  describe('loginWithService', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with authenticate path', async () => {
      await client.loginWithService('password', {
        user: {
          username: 'toto',
        },
        password: 'password',
      });
      expect(window.fetch.mock.calls[0][0]).toBe(
        'http://localhost:3000/accounts/password/authenticate'
      );
      expect(window.fetch.mock.calls[0][1].body).toBe(
        '{"user":{"username":"toto"},"password":"password"}'
      );
    });
  });

  describe('impersonate', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with impersonate path', () =>
      client
        .impersonate('token', 'user')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/impersonate'
          )
        ));
  });

  describe('refreshTokens', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with refreshTokens path', () =>
      client
        .refreshTokens('accessToken', 'refreshToken')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/refreshTokens'
          )
        ));
  });

  describe('logout', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with logout path', () =>
      client
        .logout('accessToken')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/logout'
          )
        ));
  });

  describe('getUser', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with user path', () =>
      client
        .getUser('accessToken')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/user'
          )
        ));
  });

  describe('createUser', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with register path', () =>
      client
        .createUser('user')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/password/register'
          )
        ));
  });

  describe('resetPassword', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with resetPassword path', () =>
      client
        .resetPassword('token', 'resetPassword')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/password/resetPassword'
          )
        ));
  });

  describe('verifyEmail', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with verifyEmail path', () =>
      client
        .verifyEmail('token')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/password/verifyEmail'
          )
        ));
  });

  describe('sendVerificationEmail', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with verifyEmail path', () =>
      client
        .sendVerificationEmail('email')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/password/sendVerificationEmail'
          )
        ));
  });

  describe('sendResetPasswordEmail', () => {
    const client = new RestClient({
      apiHost: 'http://localhost:3000',
      rootPath: '/accounts',
    });

    it('should call fetch with verifyEmail path', () =>
      client
        .sendResetPasswordEmail('email')
        .then(() =>
          expect(window.fetch.mock.calls[0][0]).toBe(
            'http://localhost:3000/accounts/password/sendResetPasswordEmail'
          )
        ));
  });
});
