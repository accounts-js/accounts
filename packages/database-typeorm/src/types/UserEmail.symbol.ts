import { InjectionToken } from 'graphql-modules';
import { type UserEmail } from '../entity/UserEmail';

export const UserEmailToken = new InjectionToken<typeof UserEmail>('UserEmailToken');
