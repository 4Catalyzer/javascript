const intlPlugin = require('babel-plugin-react-intl').default;

const namespacePlugin = require('./namespace-plugin');

module.exports = function reactIntlPreset(_, options = {}) {
  const { prefix, ...rest } = options;

  return {
    plugins: [
      [namespacePlugin, { prefix }],
      [intlPlugin, { extractSourceLocation: true, ...rest }],
    ],
  };
};
