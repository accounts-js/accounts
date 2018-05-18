import { RedisSessions } from '../src/redis';

describe('Redis', () => {
  describe('#constructor', () => {
    it('should throw with an invalid database connection object', () => {
      try {
        // tslint:disable-next-line
        new RedisSessions(null as any);
        throw new Error();
        expect(err.message).toBe('A database connection is required');
      }
    });
  });
});
