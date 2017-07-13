import {
  bcryptPassword,
  hashPassword,
  verifyPassword,
} from './encryption';

describe('bcryptPassword', () => {
  it('hashes password using bcrypt', async () => {
    const hash = await bcryptPassword('password');
    expect(hash).toBeTruthy();
  });
});

describe('hashPassword', () => {
  it('hashes password', async () => {
    const hash = await hashPassword('password', 'sha256');
    expect(hash).toBe('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
  });
});

describe('verifyPassword', () => {
  it('true if password matches', async () => {
    const password = 'password';
    const hash = await bcryptPassword(password);
    expect(await verifyPassword(password, hash)).toBe(true);
  });
  it('false if password does not match', () => {
    it('true if password matches', async () => {
      const password = 'password';
      const wrongPassword = 'wrongPassword';
      const hash = await bcryptPassword(password);
      expect(await verifyPassword(wrongPassword, hash)).toBe(false);
    });
  });
});
