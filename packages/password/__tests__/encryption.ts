import { bcryptPassword, hashPassword, verifyPassword } from '../src/encryption';

describe('encryption', () => {
  describe('bcryptPassword', () => {
    it('should return the hashed password', () => {
      const password = 'pass';
      expect(bcryptPassword(password)).not.toBe(password);
    });
  });

  describe('hashPassword', () => {
    it('should return the digest password', () => {
      const password = 'pass';
      expect(hashPassword(password, 'sha256')).not.toBe(password);
    });
  });

  describe('verifyPassword', () => {
    it('should return true', async () => {
      const hashedPassword = await bcryptPassword('pass');
      expect(verifyPassword('pass', hashedPassword)).toBeTruthy();
    });
  });
});