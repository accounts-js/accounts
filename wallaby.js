module.exports = function(wallaby) {
  return {
    files: [
      'src/**/*.js',
      '!src/**/*.spec.js'
    ],

    tests: [
      'src/**/*.spec.js'
    ],

    compilers: {
      'src/**/*.js': wallaby.compilers.babel()
    },

    env: {
      type: 'node'
    }
  };
};