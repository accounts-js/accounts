import { context as contextBase } from '@accounts/module-core';
import { User } from '@accounts/types';
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

export const context = async <
  IUser extends User = User,
  Ctx extends { em?: EntityManager<IDatabaseDriver<Connection>> } = object
>(
  ...args: Parameters<typeof contextBase<IUser, Ctx>>
): ReturnType<typeof contextBase<IUser, Ctx>> => contextBase(...args);
