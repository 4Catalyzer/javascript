/* eslint-disable import/no-extraneous-dependencies, no-param-reassign */

const { CLIEngine } = require('eslint');

module.exports = (config, rules, code, fileName) => {
  if (typeof rules === 'string') {
    fileName = code;
    code = rules;
    rules = {};
  }

  const cli = new CLIEngine({
    useEslintrc: false,
    baseConfig: config,

    rules: {
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
      ...rules,
    },
  });

  const linter = cli.executeOnText(code, fileName);
  return linter.results[0];
};
