let hasReact = true;
try {
  // eslint-disable-next-line
  require('eslint-plugin-react');
} catch (err) {
  hasReact = false;
}

module.exports = {
  '@typescript/adjacent-overload-signatures': 'error',
  '@typescript/ban-types': 'error',
  camelcase: 'off',
  '@typescript/camelcase': 'error',
  '@typescript/class-name-casing': 'error',
  '@typescript/interface-name-prefix': 'error',
  '@typescript/no-angle-bracket-type-assertion': 'error',
  'no-array-constructor': 'off',
  '@typescript/no-array-constructor': 'error',
  '@typescript/no-empty-interface': 'error',
  '@typescript/no-inferrable-types': 'error',
  '@typescript/no-misused-new': 'error',
  '@typescript/no-namespace': 'error',
  '@typescript/no-object-literal-type-assertion': 'error',
  '@typescript/no-parameter-properties': 'error',
  '@typescript/no-triple-slash-reference': 'error',
  'no-unused-vars': 'off',
  '@typescript/no-unused-vars': [
    'error',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      ignoreRestSiblings: false,
      argsIgnorePattern: '^_',
    },
  ],
  '@typescript/no-use-before-define': 'error',
  '@typescript/no-var-requires': 'error',
  '@typescript/prefer-namespace-keyword': 'error',
  ...(hasReact
    ? {
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        'react/prop-types': 'off',
      }
    : undefined),
};
