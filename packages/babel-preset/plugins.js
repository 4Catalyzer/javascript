module.exports = (options) =>
  [
    options.runtime && [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        corejs: options.corejs,
        useESModules: options.modules === false,
      },
    ],

    require.resolve('@babel/plugin-syntax-dynamic-import'),
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: options.loose },
    ],

    require.resolve('@babel/plugin-proposal-export-default-from'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),

    // - convenience plugins --
    require.resolve('babel-plugin-dev-expression'),
  ].filter(Boolean);
