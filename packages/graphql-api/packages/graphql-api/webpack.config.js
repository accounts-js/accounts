const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, '/lib'),
    filename: 'index.js',
    library: '@accounts/graphql-api',
    libraryTarget: 'umd',
  },
  modulesDirectories: [
    'src',
    'node_modules',
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
        },
        exclude: /node_modules/,
      },
    ],
  },
};
