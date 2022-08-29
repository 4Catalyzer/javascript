const { mkdirSync, writeFileSync } = require('fs');
const path = require('path');

const { interpolateName } = require('@formatjs/ts-transformer');
const intlPlugin = require('babel-plugin-formatjs').default;
const stringify = require('fast-json-stable-stringify');

function mergeDuplicates(messages) {
  const seen = new Map();

  return messages.filter((message) => {
    const other = seen.get(message.id);

    seen.set(message.id, message);

    if (!other) return true;

    if (
      stringify(message.description) !== stringify(other.description) ||
      message.defaultMessage !== other.defaultMessage
    ) {
      throw new Error(
        `Duplicate message id: "${message.id}", but the \`description\` and/or \`defaultMessage\` are different.`,
      );
    }
    // if they are the same, filter this one out
    return false;
  });
}

module.exports = function intlPreset(_, options = {}) {
  const {
    workspaceRoot,
    messagesDir,
    prefix,
    idInterpolationPattern = '[sha512:contenthash:base64:6]',
    extractMessages = true,
    ...rest
  } = options;

  // If a prefix is provided use it _only_ when a message has an explicit ID, otherwise fall back on default generation
  const overrideIdFn = prefix
    ? (id, defaultMessage, description, filename) =>
        id
          ? `${prefix}:${id}`
          : // same logic as the plugin
            interpolateName(
              { resourcePath: filename },
              idInterpolationPattern,
              {
                content: description
                  ? `${defaultMessage}#${description}`
                  : defaultMessage,
              },
            )
    : undefined;

  return {
    plugins: [
      [
        intlPlugin,
        {
          extractSourceLocation: true,
          idInterpolationPattern,
          overrideIdFn,
          ...rest,
          onMsgExtracted(filename, messages) {
            if (!messages?.length || !extractMessages) return;

            if (!filename.startsWith(workspaceRoot)) {
              throw new Error(
                `File "${filename}" is not under workspace root "${workspaceRoot}". ` +
                  'Please configure workspaceRoot to be a folder that contains all files being extracted',
              );
            }

            const { name, dir } = path.parse(
              path.relative(workspaceRoot, filename),
            );

            mkdirSync(path.join(messagesDir, dir), { recursive: true });

            messages = mergeDuplicates(messages);

            writeFileSync(
              path.join(messagesDir, dir, `${name}.json`),
              JSON.stringify(messages, null, 2),
            );
          },
        },
      ],
    ],
  };
};
