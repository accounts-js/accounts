import accountsExpress from '../src';
import * as express from 'express';

jest.mock('express', () => {
  const mockRouter = {
    post: jest.fn(),
    get: jest.fn(),
  };
  return {
    Router: () => mockRouter,
  };
});

const router = express.Router();

describe('express middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Defines default endpoints on given path fragment', () => {
    accountsExpress(
      {
        getServices: () => ({}),
      } as any,
      { path: 'test' }
    );
    expect(router.post.mock.calls[0][0]).toBe('test/impersonate');
    expect(router.post.mock.calls[1][0]).toBe('test/user');
    expect(router.post.mock.calls[2][0]).toBe('test/refreshTokens');
    expect(router.post.mock.calls[3][0]).toBe('test/logout');
    expect(router.post.mock.calls[4][0]).toBe('test/:service/authenticate');
  });

  it('Defines password endpoints when password service is present', () => {
    accountsExpress(
      {
        getServices: () => ({
          password: {},
        }),
      } as any,
      { path: 'test' }
    );
    expect(router.post.mock.calls[0][0]).toBe('test/impersonate');
    expect(router.post.mock.calls[1][0]).toBe('test/user');
    expect(router.post.mock.calls[2][0]).toBe('test/refreshTokens');
    expect(router.post.mock.calls[3][0]).toBe('test/logout');
    expect(router.post.mock.calls[4][0]).toBe('test/:service/authenticate');
    expect(router.post.mock.calls[5][0]).toBe('test/password/register');
    expect(router.post.mock.calls[6][0]).toBe('test/password/verifyEmail');
    expect(router.post.mock.calls[7][0]).toBe('test/password/resetPassword');
    expect(router.post.mock.calls[8][0]).toBe(
      'test/password/sendVerificationEmail'
    );
    expect(router.post.mock.calls[9][0]).toBe(
      'test/password/sendResetPasswordEmail'
    );
  });

  it('Defines oauth endpoints when oauth service is present', () => {
    accountsExpress(
      {
        getServices: () => ({
          oauth: {},
        }),
      } as any,
      { path: 'test' }
    );
    expect(router.post.mock.calls[0][0]).toBe('test/impersonate');
    expect(router.post.mock.calls[1][0]).toBe('test/user');
    expect(router.post.mock.calls[2][0]).toBe('test/refreshTokens');
    expect(router.post.mock.calls[3][0]).toBe('test/logout');
    expect(router.post.mock.calls[4][0]).toBe('test/:service/authenticate');
    expect(router.get.mock.calls[0][0]).toBe('test/oauth/:provider/callback');
  });
});
