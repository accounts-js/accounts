import AccountsSession from '../src';

const defaultName = 'accounts-js-tokens';

const mockAccountsServer = () => ({
  refreshTokens: jest.fn().mockReturnValue({
    tokens: {
      accessToken: 'newAccess',
      refreshToken: 'newRefresh',
    },
  }),
  logout: jest.fn(),
});

describe('AccountsSession', () => {
  test('should have a default options', () => {
    const accountsSession = new AccountsSession({} as any) as any;

    expect(accountsSession.options.name).toEqual(defaultName);
    expect(accountsSession.options.user.name).toEqual('user');
    expect(typeof accountsSession.options.user.resolve).toBe('function');
  });

  test('should should set', () => {
    const accountsSession = new AccountsSession({} as any);
    const req: any = {
      session: {},
    };
    const tokens = {
      accessToken: 'access',
      refreshToken: 'refresh',
    };

    accountsSession.set(req, tokens);

    expect(req.session[defaultName]).toEqual(tokens);
  });

  test('should should clear when there is no tokens to be set', () => {
    const accountsSession = new AccountsSession({} as any);
    const req: any = {
      session: {
        [defaultName]: 'tokens',
      },
    };

    accountsSession.set(req, undefined as any);

    expect(req.session[defaultName]).toEqual(null);
  });

  test('should should overwrite', () => {
    const accountsSession = new AccountsSession({} as any);
    const req: any = {
      session: {
        [defaultName]: {},
      },
    };
    const tokens = {
      accessToken: 'access',
      refreshToken: 'refresh',
    };

    accountsSession.set(req, tokens);

    expect(req.session[defaultName]).toEqual(tokens);
  });

  test('should should get', () => {
    const accountsSession = new AccountsSession({} as any);
    const tokens = {
      accessToken: 'access',
      refreshToken: 'refresh',
    };
    const req: any = {
      session: {
        [defaultName]: tokens,
      },
    };

    expect(accountsSession.get(req)).toEqual(tokens);
  });

  test('should should clear', () => {
    const accountsSession = new AccountsSession({} as any);
    const tokens = {
      accessToken: 'access',
      refreshToken: 'refresh',
    };
    const req: any = {
      session: {
        [defaultName]: tokens,
      },
    };

    accountsSession.clear(req);

    expect(req.session[defaultName]).not.toEqual(tokens);
  });

  test('should renew', () => {
    return new Promise(done => {
      const mockedServer = mockAccountsServer();
      const accountsSession = new AccountsSession(mockedServer as any);
      const tokens = {
        accessToken: 'access',
        refreshToken: 'refresh',
      };
      const req: any = {
        headers: {
          'user-agent': null,
        },
        session: {
          [defaultName]: tokens,
        },
      };

      accountsSession
        .renew(req)
        .then(newTokens => {
          expect(newTokens).toBeDefined();
          expect(accountsSession.get(req)).toEqual({
            accessToken: 'newAccess',
            refreshToken: 'newRefresh',
          });
          done();
        })
        .catch(done.fail);
    });
  });

  test('should destroy', () => {
    return new Promise(done => {
      const mockedServer = mockAccountsServer();
      const accountsSession = new AccountsSession(mockedServer as any);
      const tokens = {
        accessToken: 'access',
        refreshToken: 'refresh',
      };
      const req: any = {
        headers: {
          'user-agent': null,
        },
        session: {
          [defaultName]: tokens,
          destroy: (cb: any) => {
            delete req.session;
            cb();
          },
        },
      };

      accountsSession
        .destroy(req)
        .then(result => {
          expect(result).toBeUndefined();
          expect(mockedServer.logout).toHaveBeenCalledWith(tokens.accessToken);
          expect(accountsSession.get(req)).toBeUndefined();

          done();
        })
        .catch(done.fail);
    });
  });

  test('should renew tokens and resolve a user via middleware', () => {
    return new Promise(done => {
      const mockedServer = mockAccountsServer();
      const resolveFn = jest.fn().mockReturnValue('user');
      const accountsSession = new AccountsSession(mockedServer as any, {
        user: {
          name: 'currentUser',
          resolve: resolveFn,
        },
      });
      const tokens = {
        accessToken: 'access',
        refreshToken: 'refresh',
      };
      const req: any = {
        headers: {
          'user-agent': null,
        },
        session: {
          [defaultName]: tokens,
        },
      };
      const res: any = {};
      const next = jest.fn();

      accountsSession
        .middleware()(req, res, next)
        .then(() => {
          expect(resolveFn).toHaveBeenCalledWith({
            accessToken: 'newAccess',
            refreshToken: 'newRefresh',
          });
          expect(req.currentUser).toEqual('user');
          expect(next).toHaveBeenCalled();

          done();
        })
        .catch(done.fail);
    });
  });

  test('should have a default resolver', () => {
    return new Promise(done => {
      const user = {
        name: 'foo',
      };
      const resumeSession = jest.fn(() => user);
      const accountsSession = new AccountsSession({
        ...mockAccountsServer(),
        resumeSession,
      } as any);

      const tokens = {
        accessToken: 'access',
        refreshToken: 'refresh',
      };
      const req: any = {
        headers: {
          'user-agent': null,
        },
        session: {
          [defaultName]: tokens,
        },
      };
      const res: any = {};
      const next = () => {
        //
      };

      accountsSession
        .middleware()(req, res, next)
        .then(() => {
          expect(resumeSession).toHaveBeenCalledWith('newAccess');
          expect(req.user).toEqual(user);

          done();
        })
        .catch(done.fail);
    });
  });
});
