const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, '/lib'),
    filename: 'index.js',
    library: '@accounts/common',
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
        query: {
          babelrc: false,
          presets: ['es2015', 'stage-0'],
          plugins: [
            'transform-flow-strip-types',
            'transform-runtime',
          ],
        }
      },
    ],
  },
};
