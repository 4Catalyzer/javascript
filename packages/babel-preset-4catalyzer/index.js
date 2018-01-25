const envPreset = require('babel-preset-env');
const reactPreset = require('babel-preset-react');
const intlPreset = require('./intl-preset');

const defaultOptions = {
  target: 'web-app', // 'web' | 'node'
  intl: false,
  loose: true,
  modules: 'commonjs',
  useBuiltIns: false,
};

const defaultBrowsers = [
  'ie >= 11',
  'last 2 Edge versions',
  'last 4 Chrome versions',
  'last 4 Firefox versions',
  'last 2 Safari versions',
];

function preset(_, options = {}) {
  const production = process.env.NODE_ENV === 'production';
  const opts = Object.assign({}, defaultOptions, options);
  const target = opts.target;

  const nodeTarget = {
    node: production ? '8.3' : 'current',
  };

  const webTargets = {
    browsers: production
      ? defaultBrowsers
      : ['last 2 Chrome versions', 'last 2 Firefox versions'],
  };

  if (target === 'web' || target === 'web-app') {
    opts.targets = opts.targets || webTargets;
    opts.modules = options.modules == null ? false : options.modules;
  }

  if (target === 'node') {
    opts.targets = opts.targets || nodeTarget;
    opts.relay = false;
    opts.intl = false;
  }

  // unless the user explicitly set modules, change the default to
  // cjs in a TEST environment (jest)
  if (process.env.NODE_ENV === 'test' && options.modules == null) {
    opts.modules = 'commonjs';
  }

  const presets = [[envPreset, opts], reactPreset];

  if (opts.intl) {
    const intlOpts =
      typeof opts.intl === 'object'
        ? opts.intl
        : {
            prefix: options.prefix,
            messagesDir: 'build/messages',
          };

    if (!intlOpts.prefix) {
      throw new Error('Must include a `prefix` option when using i18n');
    }
    // production guard here so that the prefix warning occurs in development
    // as well as production
    if (production) {
      presets.push([intlPreset, intlOpts]);
    }
  }

  // We don't use the stage presets because they contain duplicate plugins
  // as the env preset,specifically things that have beein promoted to stage 4
  // since babel v6 was released. plugins in the stage-x presets won't be
  // removed per environment so we just include the ones we need here
  return {
    presets,
    plugins: [
      // - stage 3 --
      require.resolve('babel-plugin-transform-object-rest-spread'),
      // -----

      // - stage 2 --
      require.resolve('babel-plugin-syntax-dynamic-import'),
      require.resolve('babel-plugin-transform-class-properties'),
      // -----

      // - stage 1 --
      require.resolve('babel-plugin-transform-export-extensions'),
      // -----

      // - convenience plugins --
      require.resolve('babel-plugin-jsx-fragment'),
      require.resolve('babel-plugin-dev-expression'),
    ].filter(Boolean),
  };
}

module.exports = preset;
