module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest'),
    '^.+\\.(scss|less|css)$': require.resolve('./transforms/styles'),
    '^(?!.*\\.(js|jsx|ts|tsx|css|scss|less|json)$)': require.resolve(
      './transforms/file',
    ),
  },
};
