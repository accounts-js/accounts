import accountsExpress from '../src';
import { userLoader } from '../src/user-loader';

const user = { id: '1' };
const accountsServer = {
  resumeSession: jest.fn(() => user),
};
describe('userLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does noting when request has no accessToken', async () => {
    const provider = userLoader(accountsServer as any);
    const req = {};
    const res = {};
    const next = jest.fn();
    await provider(req, res, next);

    expect(accountsServer.resumeSession).not.toHaveBeenCalled();
    expect(req).toEqual({});
    expect(res).toEqual({});
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('load user to req object when access token is present on the headers', async () => {
    const provider = userLoader(accountsServer as any);
    const req = {
      headers: {
        'accounts-access-token': 'token',
      },
    };
    const reqCopy = { ...req };
    const res = {};
    const next = jest.fn();
    await provider(req, res, next);

    expect(accountsServer.resumeSession).toHaveBeenCalledWith('token');
    expect(req).toEqual({ ...reqCopy, user, userId: user.id });
    expect(res).toEqual({});
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('load user to req object when access token is present on the body', async () => {
    const provider = userLoader(accountsServer as any);
    const req = {
      body: {
        accessToken: 'token',
      },
    };
    const reqCopy = { ...req };
    const res = {};
    const next = jest.fn();
    await provider(req, res, next);

    expect(accountsServer.resumeSession).toHaveBeenCalledWith('token');
    expect(req).toEqual({ ...reqCopy, user, userId: user.id });
    expect(res).toEqual({});
    expect(next).toHaveBeenCalledTimes(1);
  });
});
