module.exports = {
  extends: [require.resolve('../../../eslint-config-4catalyzer-typescript')],
  plugins: ['react'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: [require.resolve('./tsconfig.json')],
      },
    },
  ],
};
