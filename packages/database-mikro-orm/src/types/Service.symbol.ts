import { InjectionToken } from 'graphql-modules';
import { type Service } from '../entity/Service';

export const ServiceToken = new InjectionToken<Service<any>>('ServiceToken');
