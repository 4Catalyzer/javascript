module.exports = {
  'import/first': 'off', // We put all styling imports at the end.
  // `object` is used everywhere in Relay, and we use `any` deliberately.
  'react/forbid-prop-types': ['error', {
    forbid: ['array'],
  }],
  'react/jsx-filename-extension': ['error', {
    extensions: ['.js'],
  }],
  // Taking undefined as implicit default is more consistent with the rest of
  // JavaScript.
  'react/require-default-props': 'off',
};
