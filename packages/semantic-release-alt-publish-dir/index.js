const { join } = require('path');
const { promises: fs } = require('fs');
const npmPlugin = require('@semantic-release/npm');
const { createAltPublishDir } = require('@4c/file-butler');

async function verifyConditions(pluginConfig, config) {
  const {
    options: { publish, ...rest },
  } = config;
  const nextConfig = { ...config };
  if (pluginConfig.pkgRoot && publish) {
    const plugin = []
      .concat(publish)
      .find(({ path }) => path === '@semantic-release/npm');

    nextConfig.options = {
      ...rest,
      publish: { ...plugin, pkgRoot: undefined },
    };
  }

  await npmPlugin.verifyConditions(
    { ...pluginConfig, pkgRoot: undefined },
    nextConfig,
  );
}

async function prepare(
  pluginConfig = {},
  { nextRelease: { version }, logger },
) {
  const { pkgRoot, cwd = process.cwd() } = pluginConfig;

  if (!pkgRoot) {
    logger.log(
      'Skipping alternate directory publishing because pkgRoot is not set',
    );
    return;
  }

  const pkgPath = join(cwd, './package.json');
  // eslint-disable-next-line import/no-dynamic-require
  const pkg = require(pkgPath);

  logger.log('Updating root package.json file to version %s', version);

  // update the root package since @semantic-release/npm won't;
  await fs.writeFile(pkgPath, JSON.stringify({ ...pkg, version }, null, 2));

  logger.log(`Building alternative root package.json`);

  await createAltPublishDir({ outDir: pkgRoot });
}

module.exports = { prepare, verifyConditions };
