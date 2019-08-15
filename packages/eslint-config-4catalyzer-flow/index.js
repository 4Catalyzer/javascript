module.exports = {
  extends: ['plugin:flowtype/recommended', '4catalyzer'],
  plugins: ['flowtype'],
  rules: require('./rules'),

  overrides: [
    {
      files: ['*.test.*', '**/test/**', '**/__tests__/**', '**/__mocks__/**'],
      rules: {
        'flowtype/require-valid-file-annotation': 'off',
      },
    },
  ],
};
