module.exports = {
  overrides: [
    {
      files: ['**/*.test.*', '**/test/**'],
      plugins: ['jest'],
      env: {
        jest: true,
      },
      rules: require('./rules'),
    },
  ],
};
