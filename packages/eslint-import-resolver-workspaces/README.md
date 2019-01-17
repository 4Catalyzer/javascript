# eslint-import-resolver-workspaces

A resolver plugin for [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) that
resolves yarn workspaces packages to their source code so that local development doesn't
require rebuilding dependent packages on each change.

```json
// .eslintrc
{
  "settings": {
    "workspaces": {
      "extensions": [".mjs", ".js", ".ts", ".tsx", ".json"],
      "sources": {
        "my-package/lib/*": ["packages/my-package/src/*"]
      }
    }
  }
}
```

The `sources` option follows the typescript [`paths`](https://www.typescriptlang.org/docs/handbook/module-resolution.html) format for rewriting file paths.

You can also specify `sources` in your root `package.json` under `workspace-souces`.
