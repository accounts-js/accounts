import { DatabaseFortune } from '../src';

describe('DatabaseFortune', () => {
  describe('createUser', () => {
    const db = new DatabaseFortune();
    it('creates user succesfully and returns a user id', async () => {
      const user = {
        username: 'userA',
      };
      const res = await db.createUser(user);
      expect(res).toBeDefined();
    });
  });
});
