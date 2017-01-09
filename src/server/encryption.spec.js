import {
  hashPassword,
  verifyPassword,
} from './encryption';

describe('hashPassword', () => {
  it('hashes password', async () => {
    const hash = await hashPassword('password');
    expect(hash).toBeTruthy();
  });
});

describe('verifyPassword', () => {
  it('true if password matches', async () => {
    const password = 'password';
    const hash = await hashPassword(password);
    expect(await verifyPassword(password, hash)).toBe(true);
  });
  it('false if password does not match', () => {
    it('true if password matches', async () => {
      const password = 'password';
      const wrongPassword = 'wrongPassword';
      const hash = await hashPassword(password);
      expect(await verifyPassword(wrongPassword, hash)).toBe(false);
    });
  });
});
