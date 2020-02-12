# 4Catalyzer JavaScript Style Guide

_An utterly unreasonable JavaScript style guide, mostly for trolling [@jquense](https://github.com/jquense)._

Use the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript), except where it conflicts with
how `prettier` would handle it. Also use `prettier`.

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
    document.getElementById('app'),
  );
}
```

## Directory layout

Follow the [React Router huge-apps example](https://github.com/reactjs/react-router/tree/master/examples/huge-apps). Use `shared/` at the deepest possible level for shared modules.

## Line width

79 characters, because [@taion](https://github.com/taion) doesn't want to have to resize the width of his buffers when switching between JavaScript and PEP 8-compliant Python.
