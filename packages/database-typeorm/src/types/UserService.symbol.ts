import { InjectionToken } from 'graphql-modules';
import { type UserService } from '../entity/UserService';

export const UserServiceToken = new InjectionToken<typeof UserService>('UserServiceToken');
