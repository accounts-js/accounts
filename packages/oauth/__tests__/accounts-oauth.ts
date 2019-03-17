import { AccountsOauth } from '../src';

const user = {
  id: '1',
  username: 'neo',
  email: 't1@matrix.com',
};
const mockStore = {
  findUserByServiceId: jest.fn(() => user),
  findUserByEmail: jest.fn(),
  findUserByUsername: jest.fn(),
  findUserById: jest.fn(),
  findUserByEmailVerificationToken: jest.fn(),
  findSessionById: jest.fn(),
  createUser: jest.fn(),
  setUsername: jest.fn(),
  setService: jest.fn(),
  findPasswordHash: jest.fn(),
  findUserByResetPasswordToken: jest.fn(),
  setPassword: jest.fn(),
  addResetPasswordToken: jest.fn(),
  setResetPassword: jest.fn(),
  addEmail: jest.fn(),
  removeEmail: jest.fn(),
  verifyEmail: jest.fn(),
  addEmailVerificationToken: jest.fn(),
  createSession: jest.fn(),
  updateSession: jest.fn(),
  invalidateSession: jest.fn(),
  invalidateAllSessions: jest.fn(),
};

describe('AccountsOauth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should throw invalid provider', async () => {
      const oauth = new AccountsOauth({});
      try {
        await oauth.authenticate({
          provider: 'facebook',
        });
      } catch (err) {
        expect(err.message).toBe('Invalid provider');
      }
    });

    it('should throw invalid provider if user provider was not supplied', async () => {
      const options = {
        facebook: {},
      };
      const oauth = new AccountsOauth(options as any);
      try {
        await oauth.authenticate({
          provider: 'facebook',
        });
      } catch (err) {
        expect(err.message).toBe('Invalid provider');
      }
    });

    it("should call provider's authenticate method in order to get the user itself", async () => {
      const authSpy = jest.fn(() => ({
        id: '312312',
        name: 'Mr. Anderson',
        email: 't1@matrix.com',
      }));
      const oauth = new AccountsOauth({
        facebook: {
          authenticate: authSpy,
        },
      });
      oauth.setStore(mockStore as any);

      const params = {
        provider: 'facebook',
      };
      await oauth.authenticate(params);

      expect(authSpy).toBeCalledWith(params);
    });

    it('should find a user by service id or email', async () => {
      const authSpy = jest.fn(() => ({
        id: '312312',
        name: 'Mr. Anderson',
        email: 't1@matrix.com',
      }));
      const oauth = new AccountsOauth({
        facebook: {
          authenticate: authSpy,
        },
      });
      const store = {
        ...mockStore,
        findUserByServiceId: jest.fn(),
        findUserByEmail: jest.fn(() => user),
      };
      oauth.setStore(store as any);

      const params = {
        provider: 'facebook',
      };
      await oauth.authenticate(params);

      expect(authSpy).toBeCalledWith(params);
      expect(store.findUserByServiceId).toBeCalledWith('facebook', '312312');
      expect(store.findUserByEmail).toBeCalledWith('t1@matrix.com');
    });

    it('should create a user if not found on the accounts db', async () => {
      const user2 = {
        id: '2',
        name: 'Ms. Anderson',
        email: 't2@matrix.com',
      };
      const authSpy = jest.fn(() => user2);
      const oauth = new AccountsOauth({
        facebook: {
          authenticate: authSpy,
        },
      });
      const store = {
        ...mockStore,
        findUserByServiceId: jest.fn(),
        findUserByEmail: jest.fn(),
        createUser: jest.fn(() => '34123'),
        findUserById: jest.fn(() => ({
          id: '34123',
          email: user2.email,
        })),
      };
      oauth.setStore(store as any);

      const params = {
        provider: 'facebook',
      };
      await oauth.authenticate(params);

      expect(authSpy).toBeCalledWith(params);
      expect(store.findUserByServiceId).toBeCalledWith('facebook', '2');
      expect(store.findUserByEmail).toBeCalledWith('t2@matrix.com');
      expect(store.createUser).toBeCalledWith({ email: user2.email });
      expect(store.findUserById).toBeCalledWith('34123');
      expect(store.setService).toBeCalledWith('34123', 'facebook', user2);
    });
  });

  it("should not update the user's profile if logged in after change in profile", async () => {
    const userChanged = {
      id: '312312',
      name: 'Mr. Anderson',
      email: 't1@matrix.com',
      profile: {
        gender: 'other',
      },
    };
    const authSpy = jest.fn(() => userChanged);
    const oauth = new AccountsOauth({
      facebook: {
        authenticate: authSpy,
      },
    });
    oauth.setStore(mockStore as any);

    const params = {
      provider: 'facebook',
    };
    await oauth.authenticate(params);

    expect(authSpy).toBeCalledWith(params);
    expect(mockStore.findUserByServiceId).toBeCalledWith('facebook', '312312');
    expect(mockStore.setService).toBeCalledWith(user.id, 'facebook', userChanged);
  });
});

describe('unlink', () => {
  const oauth = new AccountsOauth({
    facebook: {
      authenticate: jest.fn(),
    },
  });
  oauth.setStore(mockStore as any);

  it('should throw if given wrong provider', async () => {
    try {
      await oauth.unlink('1', 'twitter');
    } catch (e) {
      expect(e.message).toBe('Invalid provider');
    }
  });

  it('should unset data of oauth provider', async () => {
    await oauth.unlink('1', 'facebook');
    expect(mockStore.setService).toBeCalledWith('1', 'facebook', null);
  });
});
