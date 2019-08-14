module.exports = {
  // airbnb needs to take precedence; otherwise rules from airbnb-base via
  // 4catalyzer messes up some JSX linting.
  extends: ['4catalyzer', 'airbnb', 'airbnb/hooks'],
  // We still want the 4catalyzer rules to take precedence over airbnb rules.
  rules: {
    ...require('eslint-config-4catalyzer/rules'),
    ...require('./rules'),
  },
};
