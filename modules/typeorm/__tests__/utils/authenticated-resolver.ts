import { authenticated } from '../../src/utils/authenticated-resolver';

describe('authenticated-resolver', () => {
  it('should throw if no user in context', async () => {
    const spy = jest.fn();
    await expect(authenticated(spy)({}, {}, {}, {})).rejects.toThrowError('Unauthorized');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call spy if user is in the context', async () => {
    const spy = jest.fn();
    await authenticated(spy)({}, {}, { userId: 'userId', user: {} }, {});
    expect(spy).toHaveBeenCalled();
  });

  it('should call spy if no user and skipJSAccountsVerification is true', async () => {
    const spy = jest.fn();
    await authenticated(spy)({}, {}, { skipJSAccountsVerification: true }, {});
    expect(spy).toHaveBeenCalled();
  });
});
