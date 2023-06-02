import { AsyncLocalStorage } from 'async_hooks';
import { ConnectionInformations } from './connection-informations';
import { User } from './user';
import { Injector } from 'graphql-modules';

export interface IContext<IUser extends User = User> {
  injector: Injector;
  authToken?: string;
  user?: IUser;
  userId?: string;
  userAgent: string | null;
  ip: string | null;
  infos: ConnectionInformations;
}

export const ctxAsyncLocalStorage = new AsyncLocalStorage<IContext>();
