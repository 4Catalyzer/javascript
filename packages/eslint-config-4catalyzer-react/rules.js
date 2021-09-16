module.exports = {
  // We put all styling imports at the end.
  'import/first': 'off',
  'jsx-a11y/label-has-associated-control': [
    'error',
    {
      labelComponents: [],
      labelAttributes: [],
      controlComponents: [],
      assert: 'either',
      depth: 25,
    },
  ],

  // this rule is dumb
  'react/jsx-no-bind': 'off',

  // It's clearer to use required even on props with defaults to indicate
  // non-nullability.
  'react/default-props-match-prop-types': [
    'error',
    {
      allowRequiredDefaults: true,
    },
  ],
  // `object` is used everywhere in Relay, and we use `any` deliberately.
  'react/forbid-prop-types': [
    'error',
    {
      forbid: ['array'],
    },
  ],
  'react/jsx-filename-extension': [
    'error',
    {
      extensions: ['.js'],
    },
  ],
  // This would be nice to have but it's such a pain.
  'react/jsx-props-no-spreading': 'off',
  // Taking undefined as implicit default is more consistent with the rest of
  // JavaScript.
  'react/require-default-props': 'off',
  'react/destructuring-assignment': 'off',
  'react/sort-comp': [
    'error',
    {
      order: [
        'static-methods',
        'type-annotations', // This is added.
        'instance-variables',
        'lifecycle',
        '/^(on|handle).+$/',
        'getters',
        'setters',
        '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
        // Don't require grouping methods and arrows function properties.
        // 'instance-methods',
        'everything-else',
        'rendering',
      ],
      groups: {
        lifecycle: [
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'statics',
          'defaultProps',
          'constructor',
          'getDefaultProps',
          'getInitialState',
          'state',
          'getChildContext',
          'getDerivedStateFromProps',
          'componentWillMount',
          'UNSAFE_componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'UNSAFE_componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'UNSAFE_componentWillUpdate',
          'getSnapshotBeforeUpdate',
          'componentDidUpdate',
          'componentDidCatch',
          'componentWillUnmount',
          'componentDidCatch',
        ],
        rendering: ['/^render.+$/', 'render'],
      },
    },
  ],
  // This seems too fiddly to enforce. Plus the airbnb rule entry has a comment
  // saying that they'll eventually flip the value anyway.
  'react/state-in-constructor': 'off',
};
