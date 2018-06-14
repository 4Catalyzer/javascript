module.exports = {
  'class-methods-use-this': 'off',
  'max-len': ['error', 79, {
    ignorePattern: ' // eslint-disable-line ',
  }],
  'no-mixed-operators': ['error', {
    groups: [
      ['&', '|', '^', '~', '<<', '>>', '>>>'],
      ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
      ['&&', '||'],
      ['in', 'instanceof'],
    ],
    allowSamePrecedence: false,
  }],
  'no-plusplus': 'off',
  'no-restricted-syntax': ['error',
    'ForInStatement',
    // We use iterables, so allow for-of.
    'LabeledStatement',
    'WithStatement',
  ],
  'no-underscore-dangle': ['error', {
    allow: [],
    allowAfterThis: true,
    allowAfterSuper: false,
    enforceInMethodNames: false,
  }],
  'no-unused-vars': ['error', {
    vars: 'all',
    varsIgnorePattern: '^_',
    args: 'after-used',
    ignoreRestSiblings: false,
    argsIgnorePattern: '^_',
  }],
  'prefer-destructuring': [
    'error',
    {
      VariableDeclarator: {
        array: false,
        object: true,
      },
      AssignmentExpression: {
        array: true,
        object: false,
      },
    },
    { enforceForRenamedProperties: false },
  ],
  // We very seldom intentionally use async functions without await.
  'require-await': 'error',
  'import/prefer-default-export': 'off',
};
