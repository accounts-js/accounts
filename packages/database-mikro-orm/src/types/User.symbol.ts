import { InjectionToken } from 'graphql-modules';
import { type IUser } from '../entity/User';

export const UserToken = new InjectionToken<IUser<any, any, any>>('UserToken');
