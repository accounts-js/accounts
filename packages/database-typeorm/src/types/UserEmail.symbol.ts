import { InjectionToken } from 'graphql-modules';
import { UserEmail } from '../entity/UserEmail';

export const UserEmailToken = new InjectionToken<typeof UserEmail>('UserEmailToken');
