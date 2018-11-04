import { getUser } from '../../src/endpoints/get-user';

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('getUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getUser and returns the user json response', async () => {
    const user = {
      id: '1',
    };
    const middleware = getUser({} as any);

    const req = {
      user,
      body: {
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(res.json).toBeCalledWith(user);
    expect(res.status).not.toBeCalled();
  });
});
