const babelJest = require('babel-jest').default;
const findWorkspacesRoot = require('find-yarn-workspace-root');

let isWorkspaces = false;
try {
  isWorkspaces = findWorkspacesRoot();
} catch (err) {
  /* ignore */
}

module.exports = babelJest.createTransformer({
  rootMode: isWorkspaces ? 'upward-optional' : undefined,
});
