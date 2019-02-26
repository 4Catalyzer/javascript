module.exports = {
  extends: ['plugin:flowtype/recommended', '4catalyzer'],
  plugins: ['flowtype'],
  rules: require('./rules'),

  overrides: [
    {
      files: ['**/*.test.*', '**/test/**'],
      rules: {
        'flowtype/require-valid-file-annotation': 'off',
      },
    },
  ],
};
