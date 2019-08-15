module.exports = {
  // Not needed with Flow.
  'react/prop-types': 'off',
  // Flow doesn't like property assignment for defaultProps.
  'react/static-property-placement': [
    'error',
    'property assignment',
    {
      defaultProps: 'static public field',
    },
  ],
};
