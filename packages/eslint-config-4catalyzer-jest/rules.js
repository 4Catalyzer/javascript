let hasReact = true;
try {
  // eslint-disable-next-line
  require('eslint-plugin-react');
} catch (e) {
  hasReact = false;
}

module.exports = {
  'global-require': 'off',
  'max-classes-per-file': 'off',
  'no-await-in-loop': 'off',
  'no-console': 'off',
  'import/no-dynamic-require': 'off',
  'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  'jest/no-disabled-tests': 'warn',
  'jest/no-focused-tests': 'error',
  'jest/no-identical-title': 'error',
  'jest/prefer-to-have-length': 'warn',
  'jest/valid-expect': 'error',
  ...(hasReact && {
    'react/prop-types': 'off',
  }),
};
