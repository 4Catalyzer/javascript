const { extname, dirname } = require('path');
const pkgUp = require('pkg-up');
const fs = require('fs');
const findWorkspaceRoot = require('find-yarn-workspace-root');
const { createMatchPath } = require('tsconfig-paths');
const resolver = require('eslint-import-resolver-node');

const log = require('util').debuglog(
  'eslint-import-resolver-workspaces:resolver',
);

let matchPath;
const defaultExtensions = ['.mjs', '.js', '.ts', '.tsx', '.json'];

exports.interfaceVersion = 2;

function resolveToWorkspaceSource(source, file, options) {
  if (matchPath === false) return null;

  // eslint-disable-next-line prefer-const
  let { sources, extensions = defaultExtensions } = options || {};

  if (!matchPath) {
    const localRoot = pkgUp.sync(dirname(file));
    const root = localRoot && findWorkspaceRoot(dirname(localRoot));

    if (!root) {
      matchPath = false;
      return null;
    }

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
      if (extname(path)) return { found: true, path: `${path}` };

      // If the original request doesn't have an extension neither will the
      // resolved path
      for (const ext of extensions) {
        const fullPath = `${path}${ext}`;
        if (!fs.existsSync(fullPath)) continue;

        return { found: true, path: fullPath };
      }
    }
  } catch (err) {
    log(err);
  }

  return null;
}

exports.resolve = (source, file, options) => {
  // eslint-disable-next-line prefer-const
  let { extensions = defaultExtensions } = options || {};

  return (
    resolveToWorkspaceSource(source, file, options) ||
    resolver.resolve(source, file, { extensions })
  );
};
