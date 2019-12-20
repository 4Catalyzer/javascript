describe('Preset', () => {
  let preset;
  let babel;

  beforeEach(() => {
    babel = require('@babel/core');
    preset = require('../');
  });

  it('should be a valid config', () => {
    const opts = babel.loadOptions({
      presets: [[preset]],
      babelrc: false,
    });

    expect(opts.plugins).not.toHaveLength(0);
  });
});

describe('Preset esm', () => {
  let preset;
  let babel;

  beforeEach(() => {
    babel = require('@babel/core');
    preset = require('../esm');
  });

  it('should be a valid config', () => {
    const opts = babel.loadOptions({
      presets: [[preset]],
      babelrc: false,
    });

    expect(opts.plugins).not.toHaveLength(0);
  });
});
