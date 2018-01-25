const intlPlugin = require('babel-plugin-react-intl').default;

const namespacePlugin = require('./namespace-plugin');

module.exports = function reactIntlPreset(_, options = {}) {
  const { messagesDir, prefix } = options;

  return {
    plugins: [
      [namespacePlugin, { prefix }],
      [intlPlugin, { messagesDir, extractSourceLocation: true }],
    ],
  };
};
