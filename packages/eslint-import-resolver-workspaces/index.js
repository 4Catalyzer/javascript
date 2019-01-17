const { extname, dirname } = require('path');
const pkgUp = require('pkg-up');
const fs = require('fs');
const findWorkspaceRoot = require('find-yarn-workspace-root');
const { createMatchPath } = require('tsconfig-paths');
const log = require('util').debuglog(
  'eslint-import-resolver-workspaces:resolver',
);

let matchPath;
const NOT_FOUND = { found: false };
const defaultExtensions = ['.mjs', '.js', '.ts', '.tsx', '.json'];

exports.interfaceVersion = 2;

exports.resolve = (
  source,
  file,
  { sources, extensions = defaultExtensions } = {},
) => {
  if (!matchPath) {
    const localRoot = pkgUp.sync(dirname(file));
    const root = localRoot && findWorkspaceRoot(dirname(localRoot));

    if (!root) return NOT_FOUND;

    log('workspace root identified', root);

    if (!sources) {
      // eslint-disable-next-line import/no-dynamic-require, no-param-reassign
      sources = require(`${root}/package.json`)['workspace-sources'];
    }

    matchPath = createMatchPath(root, sources);
  }

  try {
    const path = matchPath(source, undefined, undefined, extensions);
    log('found workspace match', path);

    if (path) {
      if (extname(path)) {
        return { found: true, path: `${path}` };
      }

      // If the original request doesn't have an extension neither will the
      // resolved path
      for (const ext of extensions) {
        const fullPath = `${path}${ext}`;
        if (!fs.existsSync(fullPath)) continue;

        return { found: true, path: fullPath };
      }
    }
    return NOT_FOUND;
  } catch (err) {
    log(err);
    return NOT_FOUND;
  }
};
