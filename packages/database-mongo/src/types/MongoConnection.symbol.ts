import { InjectionToken } from 'graphql-modules';
import { type Db } from 'mongodb';

export const MongoConnectionToken = new InjectionToken<Db>('MongoConnection');
