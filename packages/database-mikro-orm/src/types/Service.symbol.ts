import { InjectionToken } from 'graphql-modules';
import { Service } from '../entity/Service';

export const ServiceToken = new InjectionToken<Service<any>>('ServiceToken');
