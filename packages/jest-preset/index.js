const { defaults } = require('jest-config');

module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  testMatch: [
    ...defaults.testMatch,
    // typescript
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': require.resolve('./transforms/babel'),
    '^.+\\.(scss|less|css)$': require.resolve('./transforms/styles'),
    '^(?!.*\\.(js|jsx|ts|tsx|css|scss|less|json)$)': require.resolve(
      './transforms/file'
    ),
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
};
