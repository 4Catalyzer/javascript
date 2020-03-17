const { promises: fs } = require('fs');

const { createAltPublishDir } = require('@4c/file-butler');
const npmPlugin = require('@semantic-release/npm');
const execa = require('execa');
const readPkgUp = require('read-pkg-up');

async function runLifecycle(script, pkg) {
  if (!pkg.scripts || !pkg.scripts[script]) return;
  await execa('npm', ['run', script]);
}

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

  logger.log(`Building alternative root package.json`);

  const { path: rootPkgPath, packageJson } = await readPkgUp({ cwd });

  // We run the lifecycle scripts manually to ensure they run in
  // the package root, not the publish dir
  await runLifecycle('prepublish', packageJson);
  await runLifecycle('prepare', packageJson);
  await runLifecycle('prepublishOnly', packageJson);

  await createAltPublishDir({ publishDir: pkgRoot });

  // update the root package since @semantic-release/npm won't;
  logger.log('Updating root package.json file to version %s', version);
  await fs.writeFile(
    rootPkgPath,
    JSON.stringify({ ...packageJson, version }, null, 2),
  );
}

module.exports = { prepare, verifyConditions };
