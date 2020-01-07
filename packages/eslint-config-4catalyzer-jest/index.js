let hasTsExpect = true;
try {
  // eslint-disable-next-line
  require('eslint-plugin-ts-expect');
} catch (e) {
  hasTsExpect = false;
}

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
    hasTsExpect && {
      files: [
        '*.test.*.{ts,tsx}',
        '**/test/**/*.{ts,tsx}',
        '**/__tests__/**/*.{ts,tsx}',
      ],
      plugins: ['ts-expect'],
      rules: {
        'ts-expect/expect': 'error',
      },
    },
  ].filter(Boolean),
};
