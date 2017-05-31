module.exports = {
  extends: [
    '4catalyzer-flow',
    '4catalyzer-react',
  ],
  // 4catalyzer-react overrides some 4catalyzer-flow rules from the airbnb
  // import, so we need to explicitly reapply the rules.
  rules: Object.assign(
    {},
    require('eslint-config-4catalyzer-flow/rules'),
    require('eslint-config-4catalyzer-react/rules'),
    require('./rules'),
  ),
};
