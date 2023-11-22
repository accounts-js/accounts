import { InjectionToken } from 'graphql-modules';
import { type User } from '../entity/User';

export const UserToken = new InjectionToken<typeof User>('UserToken');
