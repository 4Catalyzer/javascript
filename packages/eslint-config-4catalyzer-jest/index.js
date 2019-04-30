module.exports = {
  overrides: [
    {
      files: ['**/*.test.*', '**/test/**', '**/__test__/**'],
      plugins: ['jest'],
      env: {
        jest: true,
      },
      rules: require('./rules'),
    },
  ],
};
