const path = require('path');
const fs = require('fs-extra');
const tempy = require('tempy');
const plugin = require('../index');

describe('Prepare', () => {
  const logger = { log: console.log };

  let tmps = [];
  const fixtures = path.resolve(__dirname, 'fixtures');
  function setUpFixture(fixture) {
    const dir = tempy.directory();
    fs.copySync(path.join(fixtures, fixture), dir);
    tmps.push(dir);
    return dir;
  }

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    tmps.forEach(dir => fs.removeSync(dir));
    tmps = [];
  });

  it('should update files', async () => {
    const dir = setUpFixture('package');
    process.chdir(dir);

    await plugin.prepare(
      { pkgRoot: 'lib' },
      { nextRelease: { version: '1.0.1' }, logger },
    );

    jest.resetModules();

    expect(require(`${dir}/package.json`)).toMatchObject({
      version: '1.0.1',
    });

    expect(fs.existsSync(`${dir}/lib/README.md`)).toEqual(true);

    const libPkg = require(`${dir}/lib/package.json`);

    // Don't bump the version here; @semantic-release/npm will take care of
    // that for us.
    expect(libPkg.version).toEqual('1.0.0');
    expect(libPkg.devDependencies).not.toBeDefined();
    // expect(libPkg.release).not.toBeDefined()

    expect(libPkg.main).toEqual('index.js');
    expect(libPkg.module).toEqual('es/index.js');
  });

  it('should skip when no pkgRoot is set', async () => {
    const dir = setUpFixture('package');
    process.chdir(dir);

    await plugin.prepare({}, { nextRelease: { version: '1.0.1' }, logger });

    expect(require(`${dir}/package.json`)).toMatchObject({
      version: '1.0.0',
    });
  });
});
