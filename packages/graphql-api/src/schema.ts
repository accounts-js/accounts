/**
 * This file is used to export the schema so graphql-codegen can generate the proper types.
 * Do not import directly in your application.
 */
import { createApplication } from 'graphql-modules';
import { coreModule } from './modules/core';
import { passwordModule } from './modules/password';

const accountsServer = {
  getServices: () => ({
    password: {},
  }),
}

const application = createApplication({
  modules: [
    coreModule({
      accountsServer
    }),
    passwordModule],
});

export default application.schema;
