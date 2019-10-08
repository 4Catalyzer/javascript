module.exports = {
  extends: 'plugin:@typescript-eslint/eslint-recommended',
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/parsers': {
      [require.resolve('@typescript-eslint/parser')]: ['.ts', '.tsx'],
      // needed for typescript files importing js, since the configured parser
      // will be ts not babel-eslint for the host file
      [require.resolve('babel-eslint')]: ['.js'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: 'plugin:@typescript-eslint/recommended',
      rules: require('./rules'),
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/export': 'off',
        'import/no-duplicates': 'off',
        'max-classes-per-file': 'off',
        // This isn't needed in a type def.
        'react/prefer-stateless-function': 'off',
        'react/static-property-placement': 'off',
      },
    },
  ],
};
