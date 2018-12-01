import { QueryResolvers } from '../../../models';
import { ModuleContext } from '@graphql-modules/core';
import { AccountsModuleContext } from '..';

export const Query: QueryResolvers<ModuleContext<AccountsModuleContext>> = {
  getUser: (_, __, context) => context.user || null,
};
