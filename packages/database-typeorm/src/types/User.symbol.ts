import { InjectionToken } from 'graphql-modules';
import { User } from '../entity/User';

export const UserToken = new InjectionToken<typeof User>('UserToken');
