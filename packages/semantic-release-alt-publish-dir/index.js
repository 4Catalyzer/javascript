const path = require('path')
const fs = require('fs-extra')
const cpy = require('cpy')
const npmPlugin = require('@semantic-release/npm')
const { createAltPublishDir } = require('@4c/file-butler')

async function verifyConditions(pluginConfig, config) {
  const {
    options: { publish, ...rest },
  } = config
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

  await npmPlugin.verifyConditions(
    { ...pluginConfig, pkgRoot: undefined },
    nextConfig
  )
}

async function prepare(
  pluginConfig = {},
  { nextRelease: { version }, logger }
) {
  let { pkgRoot, cwd = process.cwd(), parents = true } = pluginConfig

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

  await createAltPublishDir({ outDir: pkgRoot })
}

module.exports = { prepare, verifyConditions }
