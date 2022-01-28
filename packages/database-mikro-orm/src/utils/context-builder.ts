import {
  AccountsContextOptions as AccountsContextOptionsBase,
  context as contextBase,
} from '@accounts/graphql-api';
import { ctxAsyncLocalStorage, User } from '@accounts/types';
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { IncomingMessage } from 'http';
import { IContext } from '../types';

interface AccountsContextOptions<IUser extends User = User>
  extends AccountsContextOptionsBase<IUser> {
  em?: EntityManager<IDatabaseDriver<Connection>>;
}

export const context = async <IUser extends User = User>(
  arg: { req: IncomingMessage },
  { em, ...options }: AccountsContextOptions<IUser>
): Promise<IContext<IUser>> => {
  return ctxAsyncLocalStorage.run({ em } as any, async () => {
    return {
      em,
      ...(await contextBase(arg, options)),
    };
  });
};
