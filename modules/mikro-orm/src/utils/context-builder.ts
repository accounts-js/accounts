import {
  AccountsContextOptions as AccountsContextOptionsBase,
  context as contextBase,
} from '@accounts/module-core';
import { User } from '@accounts/types';
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { IncomingMessage } from 'http';
import { Application } from 'graphql-modules';
import { IContext } from '../types';

interface AccountsContextOptions extends Omit<AccountsContextOptionsBase, 'injector'> {
  em?: EntityManager<IDatabaseDriver<Connection>>;
  app: Application;
}

export const context = async <IUser extends User = User>(
  arg: { req: IncomingMessage },
  { em, app, ...options }: AccountsContextOptions
): Promise<IContext<IUser>> => {
  // To inject the ExecutionContext into Providers which are called from the context
  app.createOperationController({
    context: { em },
    autoDestroy: true, // destroys the session when GraphQL Execution finishes
  });
  return {
    em,
    ...(await contextBase(arg, { ...options, injector: app.injector })),
  };
};
