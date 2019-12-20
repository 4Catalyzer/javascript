const envPreset = require('@babel/preset-env');
const modulesPreset = require('@babel/preset-modules');
const reactPreset = require('@babel/preset-react');
const plugins = require('./plugins');

function preset(api, options = {}) {
  const {
    runtime,
    useBuiltIns,
    debug,
    loose = true,
    modules = api.env() === 'test',
    development = api.env() === 'test',
  } = options;

  const presets = [
    [modulesPreset, { loose }],

    useBuiltIns && [
      envPreset,
      {
        debug,
        loose,
        targets: { esmodules: true },
        exclude: [/(transform|proposal)/],
        modules: false,
        shippedProposals: true,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    [reactPreset, { development }],
  ].filter(Boolean);

  return {
    presets,
    plugins: [
      !!modules && require.resolve('@babel/plugin-transform-modules-commonjs'),
      ...plugins({
        loose,
        modules,
        runtime,
        corejs: false,
      }),
    ].filter(Boolean),
  };
}

module.exports = preset;
