import { RedisSessions } from '../src/redis';

describe('Redis', () => {
  describe('#constructor', () => {
    it('should throw with an invalid database connection object', () => {
      try {
        new RedisSessions(null as any);
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('A database connection is required');
      }
    });
  });
});
