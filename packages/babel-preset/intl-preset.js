const { mkdirSync, writeFileSync } = require('fs');
const path = require('path');

const { interpolateName } = require('@formatjs/ts-transformer');
const intlPlugin = require('babel-plugin-formatjs').default;

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
