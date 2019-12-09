module.exports = {
  'class-methods-use-this': 'off',
  'max-len': [
    'error',
    79,
    {
      ignorePattern: ' // eslint-disable-line ',
    },
  ],
  'no-continue': 'off',
  'no-mixed-operators': [
    'error',
    {
      groups: [
        // Allow arithmetic operator grouping given well-known precedence.
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
      allowSamePrecedence: false,
    },
  ],
  'no-plusplus': 'off',
  'no-restricted-syntax': [
    'error',
    'ForInStatement',
    // We use iterables, so allow for-of.
    'LabeledStatement',
    'WithStatement',
  ],
  'no-underscore-dangle': [
    'error',
    {
      allow: [],
      allowAfterThis: true,
      allowAfterSuper: false,
      enforceInMethodNames: false,
    },
  ],
  'no-unused-vars': [
    'error',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      ignoreRestSiblings: false,
      argsIgnorePattern: '^_',
    },
  ],
  // allow `let foo, bar;`, but not `let foo = 1, bar ='hi';`
  'one-var': ['error', { initialized: 'never' }],
  'prefer-destructuring': [
    'error',
    {
      VariableDeclarator: {
        array: false,
        object: true,
      },
      AssignmentExpression: {
        array: false,
        object: false,
      },
    },
    { enforceForRenamedProperties: false },
  ],
  // We very seldom intentionally use async functions without await.
  'require-await': 'error',
  'import/extensions': 'never',
  'import/prefer-default-export': 'off',
};
