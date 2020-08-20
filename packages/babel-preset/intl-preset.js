const { dirname } = require('path');

const intlPlugin = require('babel-plugin-react-intl').default;
const readPkgUp = require('read-pkg-up');

const PREFIXES = new Map();

function getPrefixFromPackage(filename) {
  const cwd = dirname(filename);

  let prefix = PREFIXES.get(cwd);

  if (prefix == null) {
    const pkgUpResult = readPkgUp.sync({ cwd });
    prefix = pkgUpResult ? `${pkgUpResult.packageJson.name}:` : '';

    PREFIXES.set(cwd, prefix);
  }

  return prefix;
}

module.exports = function reactIntlPreset(_, options = {}) {
  const { prefix, ...rest } = options;
  const normalizedPrefix =
    !prefix || prefix.endsWith(':') ? prefix : `${prefix}:`;

  return {
    plugins: [
      [
        intlPlugin,
        {
          // should be off generally but IDK what it will break right now, so soft deprecation
          extractFromFormatMessageCall: false,
          ...rest,
          overrideIdFn: (id, _msg, _desc, filename) => {
            return `${normalizedPrefix || getPrefixFromPackage(filename)}${id}`;
          },
        },
      ],
    ],
  };
};
