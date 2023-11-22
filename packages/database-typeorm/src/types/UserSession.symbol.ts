import { InjectionToken } from 'graphql-modules';
import { type UserSession } from '../entity/UserSession';

export const UserSessionToken = new InjectionToken<typeof UserSession>('UserSessionToken');
