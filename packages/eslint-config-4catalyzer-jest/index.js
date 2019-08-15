module.exports = {
  overrides: [
    {
      files: ['*.test.*', '**/test/**', '**/__tests__/**', '**/__mocks__/**'],
      plugins: ['jest'],
      env: {
        jest: true,
      },
      rules: require('./rules'),
    },
  ],
};
