import { InjectionToken } from 'graphql-modules';
import { type Email } from '../entity/Email';

export const EmailToken = new InjectionToken<Email<any>>('EmailToken');
