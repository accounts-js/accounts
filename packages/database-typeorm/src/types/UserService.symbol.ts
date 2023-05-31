import { InjectionToken } from 'graphql-modules';
import { UserService } from '../entity/UserService';

export const UserServiceToken = new InjectionToken<typeof UserService>('UserServiceToken');
