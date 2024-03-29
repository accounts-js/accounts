import { type IUser } from '@accounts/mikro-orm';
import { context as contextBase } from '@accounts/module-core';
import { type Connection, type EntityManager, type IDatabaseDriver } from '@mikro-orm/core';
import { type IContext } from '../types';

export const context = async <
  User extends IUser<any, any, any> = IUser<any, any, any>,
  Ctx extends { em?: EntityManager<IDatabaseDriver<Connection>> } = object,
>(
  ...args: Parameters<typeof contextBase<IContext<User>, Ctx>>
): ReturnType<typeof contextBase<IContext<User>, Ctx>> => contextBase(...args);
