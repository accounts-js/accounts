import { LoginWithServiceResult } from '../../../../src/modules/accounts/resolvers/loginResult';

describe('LoginWithServiceResult', () => {
  it('returns LoginResult when tokens are available', () => {
    const res = LoginWithServiceResult.__resolveType({ tokens: {} });

    expect(res).toEqual('LoginResult');
  });

  it('returns MFALoginResult when tokens are not available', () => {
    const res = LoginWithServiceResult.__resolveType({ mfaToken: {} });

    expect(res).toEqual('MFALoginResult');
  });
});
