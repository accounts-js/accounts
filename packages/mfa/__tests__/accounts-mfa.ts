import { AccountsMfa } from '../src/accounts-mfa';

describe('AccountsMfa', () => {
  describe('authenticate', () => {
    it('should throw an error if mfaToken is not passed', () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      expect(accountsMfa.authenticate({} as any, {})).rejects.toThrowError('Invalid mfa token');
    });
  });

  describe('challenge', () => {
    it('should throw an error if mfaToken is not passed', () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      expect(accountsMfa.challenge(undefined as any, undefined as any, {})).rejects.toThrowError(
        'Invalid mfa token'
      );
    });
  });

  describe('findUserAuthenticatorsByMfaToken', () => {
    it('should throw an error if mfaToken is not passed', () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      expect(accountsMfa.findUserAuthenticatorsByMfaToken(undefined as any)).rejects.toThrowError(
        'Invalid mfa token'
      );
    });
  });
});
