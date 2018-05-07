const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs-extra')
const cpy = require('cpy')
const plugin = require('../index')
const tempy = require('tempy')

describe('Prepare', () => {
  const logger = { log: console.log }

  let tmps = []
  let fixtures = path.resolve(__dirname, 'fixtures')
  function setUpFixture(fixture) {
    const dir = tempy.directory()
    fs.copySync(path.join(fixtures, fixture), dir)
    tmps.push(dir)
    return dir
  }

  afterEach(() => {
    tmps.forEach(dir => fs.removeSync(dir))
    tmps = []
  })

  it('should update files', async () => {
    const dir = setUpFixture('package')
    process.chdir(dir)

    await plugin.prepare(
      { pkgRoot: 'lib' },
      { nextRelease: { version: '1.0.1' }, logger }
    )

    expect(await fs.readJson(`${dir}/lib/package.json`)).toMatchObject({
      version: '1.0.1',
    })
    expect(await fs.readJson(`${dir}/package.json`)).toMatchObject({
      version: '1.0.1',
    })

    expect(fs.existsSync(`${dir}/lib/README.md`)).toEqual(true)

    const libPkg = await fs.readJson(`${dir}/lib/package.json`)

    expect(libPkg.version).toEqual('1.0.1')
    expect(libPkg.devDependencies).not.toBeDefined()
    expect(libPkg.release).not.toBeDefined()

    expect(libPkg.main).toEqual('index.js')
    expect(libPkg.modules).toEqual('es/index.js')
  })

  it('should skip when no pkgRoot is set', async () => {
    const dir = setUpFixture('package')
    process.chdir(dir)

    await plugin.prepare({}, { nextRelease: { version: '1.0.1' }, logger })

    expect(await fs.readJson(`${dir}/package.json`)).toMatchObject({
      version: '1.0.0',
    })
  })
})
