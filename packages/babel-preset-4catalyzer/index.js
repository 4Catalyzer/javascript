const envPreset = require('@babel/preset-env');
const reactPreset = require('@babel/preset-react');
const pick = require('lodash/pick');
const intlPreset = require('./intl-preset');

const presetEnvOptions = [
  'configPath',
  'debug',
  'exclude',
  'forceAllTransforms',
  'ignoreBrowserslistConfig',
  'include',
  'loose',
  'modules',
  'shippedProposals',
  'spec',
  'targets',
  'useBuiltIns',
];

const defaultBrowsers = [
  'ie >= 11',
  'last 2 Edge versions',
  'last 4 Chrome versions',
  'last 4 Firefox versions',
  'last 2 Safari versions',
];

const defaultOptions = {
  target: 'web', // 'web-app' | 'node'
  intl: false,
  loose: true,
  modules: 'commonjs',
  shippedProposals: true,
  runtime: false,
  corejs: false,
  debug: false,
  ignoreBrowserslistConfig: true,
  browsers: defaultBrowsers,
};

function preset(_, explicitOptions = {}) {
  const env = _.env() || 'production'; // default to prod
  const options = Object.assign({}, defaultOptions, explicitOptions);
  const { target } = options;

  const nodeTarget = {
    node: env === 'production' ? '8.3' : 'current',
  };

  const webTargets =
    env === 'production'
      ? { browsers: options.browsers }
      : { esmodules: true };

  if (target === 'web' || target === 'web-app') {
    options.targets = options.targets || webTargets;

    // Webpack's parser (acorn) can't object rest/spread
    options.include = [
      ...(options.include || []),
      'proposal-object-rest-spread',
    ];

    // in a web app assume we are using webpack to handle modules
    // and we want the runtime
    if (target === 'web-app') {
      options.runtime =
        explicitOptions.runtime == null ? true : explicitOptions.runtime;
      options.modules =
        explicitOptions.modules == null ? false : explicitOptions.modules;
    }
  } else if (target === 'node') {
    options.targets = options.targets || nodeTarget;
    options.relay = false;
    options.intl = false;
  }

  // unless the user explicitly set modules, change the default to
  // cjs in a TEST environment (jest)
  if (env === 'test' && explicitOptions.modules == null) {
    options.modules = 'commonjs';
  }

  const presets = [[envPreset, pick(options, presetEnvOptions)], reactPreset];

  if (options.intl) {
    const intlOpts =
      typeof options.intl === 'object'
        ? options.intl
        : {
            prefix: explicitOptions.prefix,
            messagesDir: 'build/messages',
          };

    if (!intlOpts.prefix) {
      throw new Error('Must include a `prefix` option when using i18n');
    }
    // production guard here so that the prefix warning occurs in development
    // as well as production
    if (env === 'production') {
      presets.push([intlPreset, intlOpts]);
    }
  }

  return {
    presets,
    plugins: [
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
      require.resolve('@babel/plugin-syntax-optional-chaining'),
    ].filter(Boolean),
  };
}

module.exports = preset;
