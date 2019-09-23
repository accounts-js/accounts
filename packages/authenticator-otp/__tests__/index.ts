import { AuthenticatorOtp } from '../src';

const authenticatorOtp = new AuthenticatorOtp();

describe('AuthenticatorOtp', () => {
  describe('associate', () => {
    it('should generate a random secret', async () => {
      const result = await authenticatorOtp.associate('userId', {});
      expect(result).toEqual({
        secret: expect.any(String),
        otpauthUri: expect.any(String),
      });
    });
  });
});
