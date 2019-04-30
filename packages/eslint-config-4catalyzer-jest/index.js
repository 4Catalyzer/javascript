module.exports = {
  overrides: [
    {
      files: ['**/*.test.*', '**/test/**', '**/__tests__/**'],
      plugins: ['jest'],
      env: {
        jest: true,
      },
      rules: require('./rules'),
    },
  ],
};
