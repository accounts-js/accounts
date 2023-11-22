import { InjectionToken } from 'graphql-modules';
import { type Session } from '../entity/Session';

export const SessionToken = new InjectionToken<Session<any>>('SessionToken');
