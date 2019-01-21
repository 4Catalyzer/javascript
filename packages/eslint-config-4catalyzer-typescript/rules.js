let hasReact = true;
try {
  // eslint-disable-next-line
  require('eslint-plugin-react');
} catch (err) {
  hasReact = false;
}

module.exports = {
  '@typescript-eslint/adjacent-overload-signatures': 'error',
  '@typescript-eslint/ban-types': 'error',
  camelcase: 'off',
  '@typescript-eslint/camelcase': 'error',
  '@typescript-eslint/class-name-casing': 'error',
  '@typescript-eslint/interface-name-prefix': 'error',
  '@typescript-eslint/no-angle-bracket-type-assertion': 'error',
  'no-array-constructor': 'off',
  '@typescript-eslint/no-array-constructor': 'error',
  '@typescript-eslint/no-empty-interface': 'error',
  '@typescript-eslint/no-inferrable-types': 'error',
  '@typescript-eslint/no-misused-new': 'error',
  '@typescript-eslint/no-namespace': 'error',
  '@typescript-eslint/no-object-literal-type-assertion': 'error',
  '@typescript-eslint/no-parameter-properties': 'error',
  '@typescript-eslint/no-triple-slash-reference': 'error',
  'no-unused-vars': 'off',
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
  '@typescript-eslint/no-use-before-define': 'error',
  '@typescript-eslint/no-var-requires': 'error',
  '@typescript-eslint/prefer-namespace-keyword': 'error',
  ...(hasReact
    ? {
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        'react/prop-types': 'off',
      }
    : undefined),
};
