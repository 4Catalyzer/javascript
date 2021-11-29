module.exports = {
  extends: ['airbnb-base'],
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
  },
  globals: {
    __DEV__: false,
  },
  rules: require('./rules'),
};
