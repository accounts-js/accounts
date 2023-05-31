import { InjectionToken } from 'graphql-modules';
import { UserSession } from '../entity/UserSession';

export const UserSessionToken = new InjectionToken<typeof UserSession>('UserSessionToken');
