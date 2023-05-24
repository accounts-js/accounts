import { ObjectId } from 'mongodb';

export const toMongoID = (objectId: string | ObjectId) => {
  if (typeof objectId === 'string') {
    return new ObjectId(objectId);
  }
  return objectId;
};
