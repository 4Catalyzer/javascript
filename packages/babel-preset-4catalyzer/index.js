const envPreset = require('@babel/preset-env');
const reactPreset = require('@babel/preset-react');
const intlPreset = require('./intl-preset');

const defaultOptions = {
  target: 'web', // 'web-app' | 'node'
  intl: false,
  loose: true,
  modules: 'commonjs',
  shippedProposals: true,
};

const defaultBrowsers = [
  'ie >= 11',
  'last 2 Edge versions',
  'last 4 Chrome versions',
  'last 4 Firefox versions',
  'last 2 Safari versions',
];

function preset(_, explicitOptions = {}) {
  const env = process.env.NODE_ENV || 'production'; // default to prod
  const options = Object.assign({}, defaultOptions, explicitOptions);
  const { target } = options;

  const nodeTarget = {
    node: env === 'production' ? '8.3' : 'current',
  };

  const webTargets = {
    browsers:
      env === 'production'
        ? defaultBrowsers
        : ['last 2 Chrome versions', 'last 2 Firefox versions'],
  };

  if (target === 'web' || target === 'web-app') {
    options.targets = options.targets || webTargets;

    // Webpack's parser (acorn) can't object rest/spread
    options.include = ['proposal-object-rest-spread'];

    // in a web app assume we are using webpack to handle modules
    if (target === 'web-app') {
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

  const presets = [[envPreset, options], reactPreset];

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

  // We don't use the stage presets because they contain duplicate plugins
  // as the env preset, specifically things that have beein promoted to stage 4
  // since babel v6 was released. plugins in the stage-x presets won't be
  // removed per environment so we just include the ones we need here
  return {
    presets,
    plugins: [
      // - stage 2 --
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        { loose: options.loose },
      ],
      // -----

      // - stage 1 --
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      // -----

      // - convenience plugins --
      require.resolve('babel-plugin-dev-expression'),
    ].filter(Boolean),
  };
}

module.exports = preset;
