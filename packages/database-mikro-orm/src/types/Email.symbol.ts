import { InjectionToken } from 'graphql-modules';
import { Email } from '../entity/Email';

export const EmailToken = new InjectionToken<Email<any>>('EmailToken');
