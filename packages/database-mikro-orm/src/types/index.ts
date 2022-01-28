import { IUser } from '../entity/User';
import { Email } from '../entity/Email';
import { Service } from '../entity/Service';
import { Session } from '../entity/Session';
import { Connection, Constructor, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { IContext as AccountsContext, User } from '@accounts/types';

export interface AccountsMikroOrmOptions<
  CustomUser extends IUser<any, any, any>,
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>
> {
  UserEntity?: Constructor<CustomUser | IUser<any, any, any>>;
  EmailEntity?: Constructor<CustomEmail | Email<any>>;
  SessionEntity?: Constructor<CustomSession | Session<any>>;
  ServiceEntity?: Constructor<CustomService | Service<any>>;
}

export interface IContext<IUser extends User = User> extends AccountsContext<IUser> {
  em?: EntityManager<IDatabaseDriver<Connection>>;
}
