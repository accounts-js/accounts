module.exports = {
  docs: {
    Introduction: ['introduction', 'contributing'],
    'Getting started': ['getting-started', 'server', 'handling-errors', 'email', 'client'],
    Transports: [
      'transports/graphql',
      {
        type: 'category',
        label: 'Rest',
        items: ['transports/rest-express', 'transports/rest-client'],
      },
    ],
    Databases: ['databases/overview', 'databases/mongo', 'databases/redis', 'databases/typeorm'],
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
};
