import { createApplication } from 'graphql-modules';
import {
  AccountsCoreModuleConfig,
  AccountsMagicLinkModuleConfig,
  AccountsPasswordModuleConfig,
  createAccountsCoreModule,
  createAccountsMagicLinkModule,
  createAccountsPasswordModule,
} from './modules';

const { schema } = createApplication({
  modules: [
    createAccountsCoreModule({} as AccountsCoreModuleConfig),
    createAccountsPasswordModule({} as AccountsPasswordModuleConfig),
    createAccountsMagicLinkModule({} as AccountsMagicLinkModuleConfig),
  ],
});

export default schema;
