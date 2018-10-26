const babel = require('@babel/core');
const babelIstanbulPlugin = require('babel-plugin-istanbul');
const crypto = require('crypto');

const pkg = require('../package.json');

const createTransformer = (opts = {}) => ({
  canInstrument: true,
  process(src, filename, { rootDir }, transformOptions) {
    const shouldInstrument = transformOptions && transformOptions.instrument;
    const options = {
      ...opts,
      filename,
      sourceFileName: filename,
      caller: {
        name: 'jest',
        supportsStaticESM: false,
        ...opts.caller,
      },
    };
    if (shouldInstrument)
      options.auxiliaryCommentBefore = ' istanbul ignore next ';

    const config = babel.loadPartialConfig(opts);

    if (shouldInstrument) {
      config.options.plugins.push(
        babel.createConfigItem([
          babelIstanbulPlugin,
          { cwd: rootDir, exclude: [] },
        ])
      );
    }
    return babel.transform(src, options) || src;
  },

  getCacheKey(source, filename, configString) {
    const { options } = babel.loadPartialConfig(opts) || {};

    return crypto
      .createHash('md4')
      .update(
        JSON.stringify({
          source,
          options,
          version: pkg.version,
          jestConfig: configString,
          '@babel/core': babel.version,
          env: process.env.NODE_ENV || process.env.BABEL_ENV || '',
        })
      )
      .digest('hex');
  },
});

module.exports = createTransformer();
module.exports.createTransformer = createTransformer;
