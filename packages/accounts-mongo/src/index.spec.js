import Mongo from './index';

describe('Mongo', () => {
  describe('#constructor', () => {
    it('should have default options', () => {
      const mongo = new Mongo();
      expect(mongo.options).toBeTruthy();
    });

    it('should overwrite options', () => {
      const mongo = new Mongo({
        collectionName: 'users-test',
      });
      expect(mongo.options).toBeTruthy();
      expect(mongo.options.collectionName).toEqual('users-test');
    });
  });

  describe('createUser', () => {
    const mongo = new Mongo();

    it('should resolve promise', async () => {
      const ret = await mongo.createUser();
      expect(ret).toEqual('user');
    });
  });
});
