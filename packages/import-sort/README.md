# `@4c/import-sort`

An [import-sort](https://github.com/renke/import-sort#import-sort) style config and
custom parser for Javascript and Typescript (using babel).

## Install

```
yarn add -D @4c/import-sort
```

## Configuration

In a `package.json`:

```json
{
  "importSort": {
    ".js": {
      "parser": "@4c/import-sort/parser",
      "style": "@4c/import-sort"
    },
    ".ts, .tsx": {
      "parser": "@4c/import-sort/parser-ts",
      "style": "@4c/import-sort"
    }
  }
}
```

## Style

Imports are sorted into three groups: third party code, local code, styles and assets

```js
import fs from 'fs'; // Node core modules first
import pick from 'lodash/pick'; // third party deps
import Env from '@4c/env'; // scoped

import Foo from '../Foo'; // local, in shared.
import Bar from './Bar';
import Baz from './Baz';

import styles from 'styles.scss'; // style imports
```
