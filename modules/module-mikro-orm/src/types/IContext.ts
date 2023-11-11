import { IContext as AccountsContext } from '@accounts/types';
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { IUser } from '@accounts/mikro-orm';

export interface IContext<User extends IUser<any, any, any> = IUser<any, any, any>>
  extends Omit<AccountsContext, 'user'> {
  user?: User;
  em?: EntityManager<IDatabaseDriver<Connection>>;
}
