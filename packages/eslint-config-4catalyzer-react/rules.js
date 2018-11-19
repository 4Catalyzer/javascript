module.exports = {
  // We put all styling imports at the end.
  'import/first': 'off',
  // Allow <Link to>.
  // TODO: Remove this when airbnb includes this in next release.
  'jsx-a11y/anchor-is-valid': [
    'error',
    {
      components: ['Link'],
      specialLink: ['to'],
      aspects: ['noHref', 'invalidHref', 'preferButton'],
    },
  ],
  'jsx-a11y/label-has-for': [
    'error',
    {
      components: [],
      required: {
        some: ['nesting', 'id'],
      },
      allowChildren: false,
    },
  ],
  // It's clearer to use required even on props with defaults to indicate
  // non-nullability.
  'react/default-props-match-prop-types': [
    'error',
    {
      allowRequiredDefaults: true,
    },
  ],
  // `object` is used everywhere in Relay, and we use `any` deliberately.
  'react/forbid-prop-types': [
    'error',
    {
      forbid: ['array'],
    },
  ],
  'react/jsx-filename-extension': [
    'error',
    {
      extensions: ['.js'],
    },
  ],
  // Taking undefined as implicit default is more consistent with the rest of
  // JavaScript.
  'react/require-default-props': 'off',
  'react/destructuring-assignment': 'off',
};
