const { dirname } = require('path');

const readPkgUp = require('read-pkg-up');

const DEFINE_MESSAGE = 'defineMessage';
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

  const prefix = `${pkgUpResult.packageJson.name}:`;
  PREFIXES.set(dirname(pkgUpResult.path), prefix);
  return prefix;
}

function getMessagesObjectFromExpression(nodePath) {
  let currentPath = nodePath;
  while (
    currentPath.isTSAsExpression() ||
    currentPath.isTSTypeAssertion() ||
    currentPath.isTypeCastExpression()
  ) {
    currentPath = currentPath.get('expression');
  }
  return currentPath;
}

function isFormatMessageCall(callee) {
  if (!callee.isMemberExpression()) {
    return false;
  }
  const object = callee.get('object');
  const property = callee.get('property');

  return (
    property.isIdentifier() &&
    property.node.name === 'formatMessage' &&
    // things like `intl.formatMessage`
    ((object.isIdentifier() && object.node.name === 'intl') ||
      // things like `this.props.intl.formatMessage`
      (object.isMemberExpression() &&
        object.get('property').node.name === 'intl'))
  );
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
        const prefix = state.file.get(PREFIX);
        const callee = path.get('callee');

        function processMessageObject(messageObj) {
          if (!messageObj || !messageObj.isObjectExpression()) {
            return;
          }

          const idProp = messageObj.get('properties').find(p => {
            // this may be a Literal or StringLiteral depending
            // on if the key is quoted or not
            const keyNode = p.get('key').node;
            return keyNode.name === 'id' || keyNode.value === 'id';
          });

          const value = idProp && idProp.get('value');

          if (value && !value.node.value.startsWith(prefix)) {
            value.replaceWith(
              t.StringLiteral(`${prefix}${value.node.value}`), // eslint-disable-line new-cap
            );
          }
        }

        if (callee.isIdentifier() && callee.node.name === DEFINE_MESSAGES) {
          getMessagesObjectFromExpression(path.get('arguments')[0])
            .get('properties')
            .map(prop => prop.get('value'))
            .forEach(processMessageObject);
        } else if (
          isFormatMessageCall(callee) ||
          (callee.isIdentifier() && callee.node.name === DEFINE_MESSAGE)
        ) {
          const messageDescriptor = getMessagesObjectFromExpression(
            path.get('arguments')[0],
          );

          if (messageDescriptor.isObjectExpression()) {
            processMessageObject(messageDescriptor);
          }
        }
      },
    },
  };
};
