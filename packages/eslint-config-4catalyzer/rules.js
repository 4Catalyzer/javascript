module.exports = {
  'default-param-last': 'off',
  'arrow-body-style': 'off',
  'prefer-arrow-callback': 'off',
  'class-methods-use-this': 'off',
  'max-len': [
    'error',
    79,
    {
      ignorePattern: ' // eslint-disable-line ',
    },
  ],
  'no-continue': 'off',
  'no-param-reassign': 'off',
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
  'prefer-const': ['error', { destructuring: 'all' }],

  // We very seldom intentionally use async functions without await.
  'require-await': 'error',
  'sort-imports': [
    'error',
    {
      ignoreDeclarationSort: true,
    },
  ],
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      mjs: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
  'import/order': [
    'error',
    {
      groups: [
        'builtin',
        ['unknown', 'external'],
        'internal',
        ['parent', 'sibling', 'index'],
      ],
      pathGroups: [
        {
          pattern: './*.module.{css,scss,less}',
          group: 'sibling',
          position: 'after',
        },
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
      },
    },
  ],
  'import/prefer-default-export': 'off',
};
