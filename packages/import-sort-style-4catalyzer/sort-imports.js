const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { sortImports } = require('import-sort');
const parser = require('import-sort-parser-babylon');
const yargs = require('yargs');

const style = require('./index.js');

const argv = yargs
  .usage('$0 <glob> [args]')
  .help()
  .argv;


const files = glob.sync(argv._[0], { absolute: true });
const cwd = process.cwd();


files.forEach((file) => {
  const source = fs.readFileSync(file, 'utf8');

  const { code, changes } = sortImports(
    source,
    parser,
    style
  );

  console.log(code)

  if (changes.length) {
    console.log(`
${path.relative(cwd, file)}:
    ${changes.length} changes
    `);

    fs.writeFileSync(file, code, 'utf8');
  }
});
