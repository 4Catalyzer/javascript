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
  'no-unused-vars': ['error', {
    vars: 'all',
    args: 'after-used',
    ignoreRestSiblings: false,
  }],
  'import/prefer-default-export': 'off',
};
