import { InjectionToken } from 'graphql-modules';
import { Db } from 'mongodb';

export const MongoConnectionToken = new InjectionToken<Db>('MongoConnection');
