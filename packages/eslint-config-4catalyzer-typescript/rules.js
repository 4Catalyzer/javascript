let hasReact = true;
try {
  // eslint-disable-next-line
  require('eslint-plugin-react');
} catch (e) {
  hasReact = false;
}

module.exports = {
  // The tsc typechecking will take care of this more thoroughly and the plugin
  // doesn't understand type exports well.
  'import/named': 'off',
  'import/no-unresolved': 'off',
  'import/default': 'off',
  'import/namespace': 'off',

  // Allow explicit use.
  '@typescript-eslint/ban-ts-ignore': 'off',
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    {
      assertionStyle: 'as',
      // Be stricter than the base rule.
      objectLiteralTypeAssertions: 'never',
    },
  ],
  // This seems too verbose.
  '@typescript-eslint/explicit-function-return-type': 'off',
  // Allow explicit use.
  '@typescript-eslint/no-explicit-any': 'off',
  // Allow explicit use.
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      ignoreRestSiblings: false,
      argsIgnorePattern: '^_',
    },
  ],
  'no-useless-constructor': 'off',
  '@typescript-eslint/no-useless-constructor': 'error',
  // Don't allow any sort of triple slash use here.
  '@typescript-eslint/triple-slash-reference': [
    'error',
    {
      lib: 'never',
      path: 'never',
      types: 'never',
    },
  ],
  ...(hasReact && {
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/prop-types': 'off',
  }),
};
