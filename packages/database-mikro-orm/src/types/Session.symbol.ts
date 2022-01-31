import { InjectionToken } from 'graphql-modules';
import { Session } from '../entity/Session';

export const SessionToken = new InjectionToken<Session<any>>('SessionToken');
