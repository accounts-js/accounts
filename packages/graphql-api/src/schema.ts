/**
 * This file is used to export the schema so graphql-codegen can generate the proper types.
 * Do not import directly in your application.
 */
import { createApplication } from 'graphql-modules';
import { coreModule } from './modules/core';

const application = createApplication({
  modules: [coreModule],
});

export default application.schema;
