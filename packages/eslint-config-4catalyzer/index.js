module.exports = {
  extends: ['airbnb-base'],
  parser: require.resolve('@babel/eslint-parser'),
  globals: {
    __DEV__: false,
  },
  rules: require('./rules'),
};
