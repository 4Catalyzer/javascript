# 4Catalyzer JavaScript Style Guide
_An utterly unreasonable JavaScript style guide, mostly for trolling [@jquense](https://github.com/jquense)._

Use the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript), with the following additions.

## Exceptions

This guide is intended to present general guidelines. Most modules should follow this style guide and pass the associated lint checks. However, specific modules should freely disregard specific guidelines and use corresponding ESLint pragmas whenever necessary. Disable the relevant rule or rules with `eslint-disable`, and enable them again with `eslint-enable` when you're done.

```js
function renderApp() {
  /* eslint-disable global-require */
  const ClientApplication = require('./ClientApplication');
  /* eslint-enable global-require */

  ReactDOM.render(
    <AppContainer>
      <ClientApplication />
    </AppContainer>,
    document.getElementById('app')
  );
}
```

## Directory layout

Follow the [React Router huge-apps example](https://github.com/reactjs/react-router/tree/master/examples/huge-apps). Use `shared/` at the deepest possible level for shared modules.

## Import ordering

JavaScript imports go in two sections – first all imports from external packages, then all internal imports.

Sort public imports by the name of the imported module. For internal imports, place library imports first, then shared, imports, then non-shared imports. Within each section, try to sort imports by path name.

For components with an associated CSS module, name the CSS module the same as the component, and group the import separately from the JavaScript imports. The imported object should be named `styles`.

For a hypothetical `routes/Widgets/components/WidgetItem.js`:

```js
import classNames from 'classnames';
import React from 'react';
import Form from 'react-formal';
import { defineMessages, FormattedMessage } from 'react-intl';
import Relay from 'react-relay';

import ListItem from 'library/ListItem';
import SharedComponent from 'components/SharedComponent';
import WidgetHeader from './WidgetHeader';
import widgetsMessages from '../messages/widgets';
import UpdateWidgetMutation from '../mutations/UpdateWidgetMutation';

import styles from './WidgetItem.css';
```

For tests, import test-specific modules in a third section, after importing the modules under test.

## Line width

79 characters, because [@taion](https://github.com/taion) doesn't want to have to resize the width of his buffers when switching between JavaScript and PEP 8-compliant Python.
