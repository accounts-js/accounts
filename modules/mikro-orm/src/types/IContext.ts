import { IContext as AccountsContext, User } from '@accounts/types';
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

export interface IContext<IUser extends User = User> extends AccountsContext<IUser> {
  em?: EntityManager<IDatabaseDriver<Connection>>;
}
