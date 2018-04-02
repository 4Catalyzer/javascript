const path = require('path')
const fs = require('fs-extra')
const cpy = require('cpy')
const npmPlugin = require('@semantic-release/npm')

async function verifyConditions(pluginConfig, config) {
  const { options: { publish, ...rest } } = config
  const nextConfig = { ...config }
  if (pluginConfig.pkgRoot && publish) {
    const plugin = []
      .concat(publish)
      .find(({ path }) => path === '@semantic-release/npm')

    nextConfig.options = {
      ...rest,
      publish: { ...plugin, pkgRoot: undefined },
    }
  }

  await npmPlugin.verifyConditions(pluginConfig, nextConfig)
}

async function prepare(
  pluginConfig = {},
  { nextRelease: { version }, logger }
) {
  let {
    pkgRoot,
    cwd = process.cwd(),
    assets = ['README.md', 'CHANGELOG.md'],
    parents = true,
  } = pluginConfig

  if (!pkgRoot) {
    logger.log(
      'Skipping alternate directory publishing because pkgRoot is not set'
    )
    return
  }

  const pkgPath = path.join(cwd, './package.json')
  const pkg = await fs.readJson(pkgPath)

  logger.log('Updating root package.json file to version %s', version)

  // update the root package since @semantic-release/npm won't;
  await fs.writeJson(pkgPath, { ...pkg, version }, { spaces: 2 })

  logger.log(`Building alternative root package.json`)
  delete pkg.files // because otherwise it would be wrong
  delete pkg.scripts
  delete pkg.devDependencies
  delete pkg.release // this also doesn't belong to output

  //
  ;['main', 'modules', 'js:next'].forEach(key => {
    if (typeof pkg[key] !== 'string') return
    pkg[key] = pkg[key].replace(new RegExp(pkgRoot + '\\/?'), '')
    logger.log(`Changing package mains: "${key}" to %s`, pkg[key])
  })

  const patterns = [...assets, `!${pkgRoot}/**`]
  await cpy(patterns, pkgRoot, { parents, cwd })

  logger.log(`Outputing ${pkgRoot}/package.json`)
  await fs.outputJson(
    path.join(cwd, pkgRoot, 'package.json'),
    { ...pkg, version },
    { spaces: 2 }
  )
}

module.exports = { prepare, verifyConditions }
