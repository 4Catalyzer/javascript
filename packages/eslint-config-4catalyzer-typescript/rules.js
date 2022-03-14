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

  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': [
    'error',
    {
      ignoreTypeValueShadow: true,
      ignoreFunctionTypeParameterNameValueShadow: true,
    },
  ],

  // Allow explicit use.
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    {
      assertionStyle: 'as',
      // Be stricter than the base rule.
      objectLiteralTypeAssertions: 'never',
    },
  ],
  // This seems too verbose.
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  camelcase: 'off',
  // Match something like a stricter upstream camelcase.
  '@typescript-eslint/naming-convention': [
    'error',
    {
      "selector": [
        "classProperty",
        "objectLiteralProperty",
        "typeProperty",
        "classMethod",
        "objectLiteralMethod",
        "typeMethod",
        "accessor",
        "enumMember"
      ],
      "format": null,
      "modifiers": ["requiresQuotes"]
    },
    {
      selector: 'default',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      leadingUnderscore: 'allow',
    },
    {
      selector: 'typeLike',
      format: ['PascalCase'],
    },
    {
      selector: 'enumMember',
      format: ['UPPER_CASE'],
    },
  ],
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
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': 'error',
  'no-useless-constructor': 'off',
  '@typescript-eslint/no-useless-constructor': 'error',
  'no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-expressions': 'error',
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
