const DEFINE_MESSAGES = 'defineMessages';

module.exports = function namespacePlugin({ types: t }) {
  return {
    visitor: {
      CallExpression(path, state) {
        let PREFIX = state.opts.prefix;
        const callee = path.get('callee').node;

        if (!t.isIdentifier(callee) || callee.name !== DEFINE_MESSAGES) {
          return;
        }

        if (!PREFIX.endsWith(':')) {
          PREFIX = `${PREFIX}:`;
        }

        function processMessageObject(messageObj) {
          if (!messageObj || !messageObj.isObjectExpression()) {
            return;
          }

          const idProp = messageObj
            .get('properties')
            .find(p => p.get('key').node.name === 'id')
            .get('value');

          if (idProp && !idProp.node.value.startsWith(PREFIX)) {
            idProp.replaceWith(
              t.StringLiteral(PREFIX + idProp.node.value), // eslint-disable-line new-cap
            );
          }
        }

        path
          .get('arguments')[0]
          .get('properties')
          .map(prop => prop.get('value'))
          .forEach(processMessageObject);
      },
    },
  };
};
