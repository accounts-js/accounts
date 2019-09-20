import { getUser } from '../../src/endpoints/get-user';

const res: any = {
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
    const middleware = getUser();

    const req = {
      user,
      body: {
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(res.json).toHaveBeenCalledWith(user);
    expect(res.status).not.toHaveBeenCalled();
  });
});
