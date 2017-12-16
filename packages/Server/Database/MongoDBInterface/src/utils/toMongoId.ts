import { ObjectID } from 'mongodb';

export const toMongoID = ( objectId ) => 
typeof objectId === 'string' 
? new ObjectID(objectId) 
: objectId