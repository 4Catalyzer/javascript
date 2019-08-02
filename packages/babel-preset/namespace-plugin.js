const { dirname } = require('path');
const readPkgUp = require('read-pkg-up');

const DEFINE_MESSAGES = 'defineMessages';

const COMPONENT_NAMES = ['FormattedMessage', 'FormattedHTMLMessage'];

function getPrefix(state) {
  let { prefix } = state.opts;
  if (prefix && !prefix.endsWith(':')) prefix = `${prefix}:`;
  return prefix;
}

function referencesImport(path) {
  if (!(path.isIdentifier() || path.isJSXIdentifier())) return false;
  return COMPONENT_NAMES.some(name =>
    path.referencesImport('react-intl', name),
  );
}

const PREFIXES = new Map();

const PREFIX = Symbol('namespace prefix');

function getPrefixFromPackage(filename) {
  for (const [root, prefix] of PREFIXES.entries()) {
    if (filename.startsWith(root)) {
      return prefix;
    }
  }

  const pkgUpResult = readPkgUp.sync({ cwd: dirname(filename) });
  if (!pkgUpResult) return '';

  const prefix = `${pkgUpResult.package.name}:`;
  PREFIXES.set(dirname(pkgUpResult.path), prefix);
  return prefix;
}

module.exports = function namespacePlugin({ types: t }) {
  return {
    pre(file) {
      const prefix =
        getPrefix(this) || getPrefixFromPackage(file.opts.filename);

      file.set(PREFIX, prefix);
    },
    visitor: {
      JSXOpeningElement(path, state) {
        const name = path.get('name');
        if (!referencesImport(name)) return;

        const prefix = state.file.get(PREFIX);

        const idAttr = path
          .get('attributes')
          .find(attr => attr.isJSXAttribute() && attr.node.name.name === 'id');

        if (idAttr && !idAttr.node.value.value.startsWith(prefix)) {
          idAttr
            .get('value')
            .replaceWith(
              t.StringLiteral(`${prefix}${idAttr.node.value.value}`),
            );
        }
      },

      CallExpression(path, state) {
        const callee = path.get('callee').node;

        if (!t.isIdentifier(callee) || callee.name !== DEFINE_MESSAGES) {
          return;
        }

        const prefix = state.file.get(PREFIX);

        function processMessageObject(messageObj) {
          if (!messageObj || !messageObj.isObjectExpression()) {
            return;
          }

          const idProp = messageObj
            .get('properties')
            .find(p => p.get('key').node.name === 'id')
            .get('value');

          if (idProp && !idProp.node.value.startsWith(prefix)) {
            idProp.replaceWith(
              t.StringLiteral(`${prefix}${idProp.node.value}`), // eslint-disable-line new-cap
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
