module.exports = {
  extends: [
    '4catalyzer',
    'plugin:flowtype/recommended',
  ],
  plugins: [
    'flowtype',
  ],
  rules: {
    'no-duplicate-imports': 'off', // Covered by 'import/no-duplicates'.
    'flowtype/delimiter-dangle': ['error', 'always-multiline'],
    'flowtype/require-valid-file-annotation': ['error', 'always', {
      annotationStyle: 'block',
    }],
    'flowtype/semi': 'error',
    'flowtype/use-flow-type': 'error',
  },
};
