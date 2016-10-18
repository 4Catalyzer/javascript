module.exports = {
  extends: [
    'airbnb',
    '4catalyzer',
  ],
  rules: {
    // `object` is used everywhere in Relay, and we use `any` deliberately.
    'react/forbid-prop-types': ['error', {
      forbid: ['array'],
    }],
    'react/jsx-filename-extension': ['error', {
      extensions: ['.js'],
    }],
    'react/no-unused-prop-types': ['error', {
      skipShapeProps: true,
    }],
  },
};
