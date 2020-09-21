// XXX: These are polyfills that get included, even in modern browsers due to small bugs
// in their implementations. It's relatively unlikely that these bugs will case an issue
// so the savings of excluding them proactively is probably worth it.
const loosePolyfills = [
  /^es\.promise$/,
  /^es\.array\.iterator/,
  /^es\.array\.sort/,
  /^es\.array\.splice/,
  /^es\.array\.slice/,
  /^es\.array\.index-of/,
  /^es\.array\.reverse/,
  /^es\.array\.last-index-of/,
  /^es\.object\.assign/,
  /^es\.array\.iterator/,
  /^es\.string\.match/,
  /^es\.string\.replace/,
  // this is always added and never used
  /^web\.dom-collections/,
];

module.exports = (options) =>
  [
    options.runtime && [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        // corejs is handled by the polyfills plugin
        corejs: false,
        // use an esm version of babel/runtime
        useESModules: options.modules === false,
        // alias global regenerator calls to import
        regenerator: true,
        // remove local helpers for import
        helpers: true,
      },
    ],
    options.includePolyfills && [
      require.resolve('babel-plugin-polyfill-corejs3'),
      {
        exclude: loosePolyfills,
        version: '3.100', // a very high minor to ensure it's using any v3
        ...options.includePolyfills,
      },
    ],

    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-proposal-export-default-from'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),

    // - convenience plugins --
    require.resolve('babel-plugin-dev-expression'),
  ].filter(Boolean);

module.exports.exclude = [...loosePolyfills];
