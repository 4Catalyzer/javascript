# `@4c/tsconfig`

A set of shareable `tsconfig.json` for typescript projects

## Install

```sh
yarn add @4c/tsconfig -D
```


## Usage

### `base.json` 

A generic config meant to be extended for specific use-cases

```js
{
  "extends": "@4c/tsconfig/base.json"
}
```

### `web.json`

A set of defaults for DOM based projects.

```js
{
  "extends": "@4c/tsconfig/web.json"
}
```

### `node.json`

A set of defaults for Node.js based projects. Expects `@types/node` to be installed

```js
{
  "extends": "@4c/tsconfig/node.json"
}
```

### `workspaces.json`

The `web` config, but with an added plugin for resolution of yarn workspace projects in VSCode, so each package
does not have to be built while developing for types.

```js
{
  "extends": "@4c/tsconfig/workspaces.json"
}
```
