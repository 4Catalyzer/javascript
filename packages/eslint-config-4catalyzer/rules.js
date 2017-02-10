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
  'no-param-reassign': 'off',
  'no-plusplus': 'off',
  'no-restricted-syntax': ['error',
    'ForInStatement',
    // We use iterables, so allow for-of.
    'LabeledStatement',
    'WithStatement',
  ],
  'import/prefer-default-export': 'off',
};
