const path = require('path');
const envPreset = require('@babel/preset-env');
const { loadConfig } = require('browserslist');
const modulesPreset = require('@babel/preset-modules');
const reactPreset = require('@babel/preset-react');
const plugins = require('./plugins');

function getTargets({ configPath, ignoreBrowserslistConfig }) {
  if (
    ignoreBrowserslistConfig ||
    !loadConfig({ path: path.resolve(configPath) })
  ) {
    return { esmodules: true };
  }

  // nothing so preset env looks for the browserslist config
  return undefined;
}

/**
 * This is an experimental preset that uses the leaner preset-modules. It's
 * seperate from the other one for quicker iteration and to make more clear it's
 * not stable
 */
function preset(api, options = {}) {
  const {
    runtime,
    useBuiltIns,
    debug = true,
    loose = true,
    configPath = '.',
    ignoreBrowserslistConfig = false,
    modules = api.env() === 'test',
    development = api.env() === 'test',
  } = options;

  const presets = [
    [modulesPreset, { loose }],

    [
      envPreset,
      {
        debug,
        loose,
        targets: getTargets({ configPath, ignoreBrowserslistConfig }),
        exclude: [/transform/],
        modules: false,
        shippedProposals: true,
        useBuiltIns,
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
