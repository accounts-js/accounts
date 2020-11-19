const tsJestPreset = require('ts-jest/jest-preset');
const jestMongodbPreset = require('@shelf/jest-mongodb/jest-preset');

module.exports = {
  ...tsJestPreset,
  ...jestMongodbPreset,
};
