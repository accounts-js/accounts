import { RedisSessions } from '../src/redis';

describe('Redis', () => {
  describe('#constructor', () => {
    it('should throw with an invalid database connection object', () => {
      expect(() => new RedisSessions(null as any)).toThrowError(
        'A database connection is required'
      );
    });
  });
});
