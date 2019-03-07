const { loadConfig } = require('browserslist');
const pick = require('lodash/pick');
const path = require('path');
const envPreset = require('@babel/preset-env');
const reactPreset = require('@babel/preset-react');

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
  targets: undefined, // Targets for @babel/preset-env.
  ignoreBrowserslistConfig: false,
  configPath: '.',
  include: [],
  exclude: [
    // Seems to be added by default with minimum benefit.
    'web.dom.iterable',
  ],
};

function getTargets(
  env,
  { target, targets, configPath, ignoreBrowserslistConfig },
) {
  if (env !== 'production') {
    return target === 'node' ? { node: 'current' } : { esmodules: true };
  }

  // TODO: Distinguish between app and libraries for node as well.
  if (target === 'node') return { node: '10.0' };

  if (
    ignoreBrowserslistConfig ||
    !loadConfig({ path: path.resolve(configPath) })
  ) {
    return targets || defaultBrowsers;
  }

  // We don't run browserslist ourself b/c that would require doing a bunch
  // of additional transforms to get the output in a format preset-env would
  // accept.
  return targets || undefined;
}

function preset(api, explicitOptions = {}) {
  // FIXME: This is meant to default to production, but Babel actually defaults
  //  us to development.
  const env = api.env(); // || 'production';

  const options = Object.assign({}, defaultOptions, explicitOptions);
  const { target } = options;

  options.targets = getTargets(env, options);

  if (target === 'web' || target === 'web-app') {
    options.include = [
      ...options.include,
      // Webpack's parser (acorn) can't handle object rest/spread
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
      require.resolve('@babel/plugin-proposal-optional-chaining'),
    ].filter(Boolean),
  };
}

module.exports = preset;
