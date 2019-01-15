module.exports = {
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/parsers': {
      [require.resolve('typescript-eslint-parser')]: ['.ts', '.tsx'],
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
      files: ['**/*.ts', '**/*.tsx'],
      parser: require.resolve('eslint-plugin-typescript/parser'),
      parserOptions: {
        sourceType: 'module',
      },
      plugins: ['typescript'],
      rules: require('./rules'),
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/no-duplicates': 'off',
        'import/export': 'off',
      },
    },
  ],
};
