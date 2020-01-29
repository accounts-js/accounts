import { ObjectID } from 'mongodb';
import { toMongoID } from '../src/utils';

describe('utils', () => {
  describe('toMongoID', () => {
    it('should return a new ObjectID when passing a string', () => {
      const res = toMongoID('589871d1c9393d445745a57c');
      expect(res).toBeInstanceOf(ObjectID);
    });

    it('should throw when mongo id is not valid', async () => {
      expect(() => toMongoID('invalid_hex')).toThrowError(
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      );
    });

    it('should be fine to pass an ObjectID', () => {
      const res = toMongoID(new ObjectID('589871d1c9393d445745a57c'));
      expect(res).toBeInstanceOf(ObjectID);
    });
  });
});
