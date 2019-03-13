# `@4c/babel-preset`

A configurable, batteries included, babel preset for libraries and web apps.

Includes the following presets and plugins:

- [preset-env](https://babeljs.io/docs/en/babel-preset-env#modules)
- [preset-react](https://babeljs.io/docs/en/babel-preset-react)
- [react-intl](https://github.com/yahoo/babel-plugin-react-intl)
- [class-properties](https://babeljs.io/docs/en/babel-plugin-syntax-class-properties)
- [dev-expression](https://www.npmjs.com/package/babel-plugin-dev-expression)
- [export-extensions](https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from)
- [optional-chaining](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining)

## Install

```sh
yarn add @4c/babel-preset -D
```

## Configure

Without options:

```json
{
  "presets": ["@4c"]
}
```

With options;

```json
{
  "presets": [
    [
      "@4c",
      {
        "target": "web-app",
        "modules": false,
        "intl": { "prefix" "@mylib" },
      }
    ]
  ]
}
```

## Options

In addition to the options below, all [preset-env](https://babeljs.io/docs/en/babel-preset-env#modules) are
accepted to be overridden when the defaults aren't sufficient. By default the preset
picks a set of known safe combinations tailored to the chosen `target`.

### `target`

`'web' | 'web-app' | 'node'`, defaults to `'web'`

The overall build environment target. Used to set some smart presets as well as
configure the `preset-env` targets.

**node**

- `targets` set to node `10` in production and `current` in development
- `modules` set to `commonjs`
- `intl` is disabled

**web**

- `targets` uses the browserlist config is (determined by .browserslistrc, etc) if available or
  defaults to `['ie >= 11', 'last 2 Edge versions', 'last 4 Chrome versions', 'last 4 Firefox versions', 'last 2 Safari versions'];`

**web-app**

- uses the same targets as `web`
- defaults `modules` to `false`
- defaults `runtime` to `true`

### `development`

`boolean`, defaults to `false`

Uses a more development friendly set of `targets` as well as toggles development plugins for react ([see](https://babeljs.io/docs/en/babel-preset-react#development). When `true` the `current` version of node for node targets and
`esmodules` for web targets. You can read more [here](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules).

### `modules`

`"commonjs' | false`, defaults to `false` except when `target` is `'web-app'` and `'commonjs'` otherwise

The [preset-env](https://babeljs.io/docs/en/babel-preset-env#modules) modules option. controls the output module format

### `runtime`

Turns on the babel runtime transform.

### `intl`

`boolean | { prefix: string, messagesDir: string }`

Configures the `react-intl` babel plugin to extract and output localized strings
prefixed by the package name or provided `prefix`
