/* eslint-disable no-console */

const path = require('path');

const envPreset = require('@babel/preset-env');
const reactPreset = require('@babel/preset-react');
const { loadConfig } = require('browserslist');
const pick = require('lodash/pick');

const intlPreset = require('./intl-preset');
const plugins = require('./plugins');

function warn(msg) {
  console.warn(`@4c/babel-preset: ${msg}`);
}

const PRESET_ENV_OPTIONS = [
  'targets',
  'spec',
  'loose',
  'modules',
  'debug',
  'bugfixes',
  'include',
  'exclude',
  'useBuiltIns',
  'corejs',
  'forceAllTransforms',
  'configPath',
  'ignoreBrowserslistConfig',
  'shippedProposals',
];

function getTargets({
  development,
  target,
  targets,
  configPath,
  ignoreBrowserslistConfig,
}) {
  if (development) {
    return target === 'node' ? { node: 'current' } : { esmodules: true };
  }

  // TODO: Distinguish between app and libraries for node as well.
  if (target === 'node') return { node: '12.0' };

  if (
    ignoreBrowserslistConfig ||
    !loadConfig({ path: path.resolve(configPath) })
  ) {
    return targets || { esmodules: true };
  }

  // We don't run browserslist ourself b/c that would require doing a bunch of
  // additional transforms to get the output in a format preset-env would
  // accept.
  return targets || undefined;
}

function addDefaultOptions(explicitOptions) {
  const options = {
    target: 'web', // 'web-app' | 'node'
    development: false,

    targets: undefined,
    spec: false,
    loose: true,
    bugfixes: true,
    modules: 'commonjs',
    debug: false,
    include: [],
    exclude: [],

    forceAllTransforms: false,
    configPath: '.',
    ignoreBrowserslistConfig: false,
    shippedProposals: true,

    includePolyfills: false,

    runtime: false,
    corejs: false,
    intl: false,

    ...explicitOptions,
  };

  options.targets = getTargets(options);
  options.includePolyfills =
    explicitOptions.includePolyfills == null
      ? options.target === 'web-app'
      : explicitOptions.includePolyfills;

  if (options.includePolyfills) {
    // e.g `{ includePolyfills: 'usage-global' }`
    const explicitPolyfill =
      typeof options.includePolyfills === 'string'
        ? { method: options.includePolyfills }
        : options.includePolyfills;

    options.includePolyfills = {
      ignoreBrowserslistConfig: options.ignoreBrowserslistConfig,
      method: 'usage-global',
      shippedProposals: options.shippedProposals,
      targets: options.targets,
      ...explicitPolyfill,
    };
  }

  // Enforce a good config, preventing corejs in preset-env as well
  // as the polyfill plugin
  if (options.includePolyfills) {
    if (options.corejs || options.useBuiltIns) {
      warn(
        `The preset-env options corejs and useBuiltIns were provided along with includePolyfills. Do not include any polyfill related preset-env options with \`includePolyfills\` they are incompatible with each other.`,
      );
    }
  } else if (options.corejs || options.useBuiltIns) {
    warn(
      `Use includePolyfills instead of the corejs and useBuiltIns options for including polyfills`,
    );
  }

  // Why are we setting these? WELL, useBuiltIns does two things:
  //
  // - Adds corejs polyfills for detected features
  // - Uses native API's for runtime (helper) code
  //
  // We want the latter behavior so that things like `_extends` aren't added to the
  // code when Object.assign is supported for all browsers. HOWEVER, we DO NOT
  // want preset-env to include polyfills for these, that is handled (if requested)
  // by `includePolyfills`. SO we enable useBuiltIns, but exclude ALL polyfills from
  // the transforms so they aren't added.
  options.corejs = 3;
  options.useBuiltIns = 'usage';
  options.exclude.push(/^(es|es6|es7|esnext|web)\./);

  return options;
}

/**
 *
 * ## Compilation Targets
 * The babel preset considers three different compile "targets" that encompass
 * common babel usage environments:
 *
 * - web libraries
 * - web apps
 * - NodeJS libraries or services
 *
 * Each has different optimal configuration.
 *
 * ### Web Libraries
 *
 * Libraries that are used as dependences in web apps. Libs should generally not
 * include polyfills, globally or otherwise. Require users provide their own for
 * things that are mostly points of browser compatibility. Users should bring their
 * own Promise, or Map/Set polyfills. The small exception to this is for platform
 * features that are proposals or poorly implements across engines. First consider if
 * they are needed at all. If required, they should be included _manually_ as part
 * of the bundle, not included automatically by the preset. Overall opinions around
 * browser support should be left to the consumer if possible.
 *
 * Libraries generally produce babel output targeting CommonJS as well as ES modules.
 *
 * ### Web Apps
 *
 * As the final compilation target, web apps have the most opinion around them.
 *
 * They should provide all polyfills as appropriate for their level of browser support,
 * which should be defined in a browserslist config file. By default the `web-app`
 * target:
 *  - turns off `module` compilation, leaving it to webpack in order to benefit from
 *    dependency graph optimizations, such as treeshaking.
 *  - turns on Polyfilling by 'usage-global' for everything that needs it
 *  - Turns on babel/runtime to consolidate common helper code
 *
 * ### NodeJS
 *
 * For node services or libraries, the preset is streamlined to only compile to
 * a Node 12 (or latest LTS). In addition, polyfilling is not enabled and should
 * be configured based on the situation (i.e. not for libraries).
 *
 * ## Browser Support
 *
 * By default we target modern browsers that support `esm` syntax. The reason being
 * is it allows clever conditional loading of smaller bundles to newer browsers. It
 * also provides a nice line that produces minimal compiled es6 code. For all
 * browsers that support esm they also support:
 *
 *  - async/await
 *  - generators
 *  - arrow functions
 *  - const/let
 *  - classes
 */
function preset(api, explicitOptions = {}) {
  const options = addDefaultOptions(explicitOptions);
  const { target, development } = options;

  // In a web app, assume we are using Webpack to handle modules, and use the
  // runtime for Babel helpers.
  if (target === 'web-app') {
    options.runtime =
      explicitOptions.runtime == null ? true : explicitOptions.runtime;
    options.modules =
      explicitOptions.modules == null ? false : explicitOptions.modules;
  }

  // unless the user explicitly set modules, change the default to
  // cjs in a TEST environment (jest)
  if (api.env() === 'test' && explicitOptions.modules == null) {
    options.modules = 'commonjs';
  }

  const presets = [
    [envPreset, pick(options, PRESET_ENV_OPTIONS)],
    [reactPreset, { development }],
  ];

  if (options.intl) {
    const intlOpts =
      typeof options.intl === 'object'
        ? options.intl
        : {
            prefix: explicitOptions.prefix,
            messagesDir: 'build/messages',
          };

    if (!development) {
      presets.push([intlPreset, intlOpts]);
    }
  }

  return {
    presets,
    plugins: plugins(options),
  };
}

module.exports = preset;
