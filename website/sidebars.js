const { readdirSync } = require('fs');
const { resolve } = require('path');

const apiDocsDir = resolve(__dirname, '..', 'website', 'docs', 'api');

const dirs = readdirSync(apiDocsDir);

const generatedApi = {};

dirs.forEach(dir => {
  const generatedSidebar = require(resolve(
    __dirname,
    '..',
    'website',
    'docs',
    'api',
    dir,
    'sidebars'
  ));
  generatedApi[dir] = [];
  if (Object.keys(generatedSidebar.docs).length > 0) {
    generatedApi[dir] = Object.keys(generatedSidebar.docs).map(key => ({
      type: 'category',
      label: key,
      items: generatedSidebar.docs[key],
    }));
  }
  generatedApi[dir].unshift(`api/${dir}/globals`);
  generatedApi[dir].unshift(`api/${dir}/index`);
});

module.exports = {
  docs: {
    Introduction: ['introduction', 'contributing'],
    'Getting started': ['getting-started', 'email', 'client'],
    Transports: [
      'transports/graphql',
      {
        type: 'category',
        label: 'Rest',
        items: ['transports/rest-express', 'transports/rest-client'],
      },
    ],
    Databases: ['databases/mongo', 'databases/redis', 'databases/typeorm'],
    Strategies: [
      {
        type: 'category',
        label: 'Password',
        items: ['strategies/password', 'strategies/password-client'],
      },
      'strategies/facebook',
      'strategies/oauth',
      'strategies/twitter',
    ],
    Cookbook: ['cookbook/react-native'],
  },
  api: generatedApi,
};
