const path = require('path')
const fs = require('fs-extra')
const cpy = require('cpy')

async function prepare(pluginConfig = {}, { nextRelease: { version } }) {
  let {
    cwd = process.cwd(),
    publishDir,
    pkgRoot = 'lib',
    assets = ['README.md', 'CHANGELOG.md'],
    parents = true,
  } = pluginConfig

  pkgRoot = publishDir || pkgRoot
  const pkgPath = path.join(cwd, './package.json')
  const pkg = await fs.readJson(pkgPath)

  // update the root package since @semantic-release/npm won't;
  await fs.writeJson(pkgPath, { ...pkg, version }, { spaces: 2 })

  delete pkg.files // because otherwise it would be wrong
  delete pkg.scripts
  delete pkg.devDependencies
  delete pkg.release // this also doesn't belong to output
  ;['main', 'modules', 'js:next'].forEach(key => {
    if (typeof pkg[key] !== 'string') return
    pkg[key] = pkg[key].replace(new RegExp(pkgRoot + '\\/?'), '')
  })

  const patterns = [...assets, `!${pkgRoot}/**`]
  await cpy(patterns, pkgRoot, { parents, cwd })

  await fs.outputJson(
    path.join(cwd, pkgRoot, 'package.json'),
    { ...pkg, version },
    { spaces: 2 }
  )
}

module.exports = { prepare }
