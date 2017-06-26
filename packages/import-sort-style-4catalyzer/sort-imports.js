#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { sortImports } = require('import-sort');
const parser = require('import-sort-parser-babylon');
const yargs = require('yargs');

const style = require('./index.js');

const cwd = process.cwd();
const argv = yargs
  .usage('$0 <glob> [args]')
  .help()
  .argv;


const files = argv._.reduce((a, pattern) => (
  a.concat(glob.sync(`${pattern}/**/*js`, { absolute: true }))
), []);


files.forEach((file) => {
  const source = fs.readFileSync(file, 'utf8');

  const { code, changes } = sortImports(
    source,
    parser,
    style
  );

  if (changes.length) {
    console.log(`
${path.relative(cwd, file)}:
    ${changes.length} changes
    `);

    fs.writeFileSync(file, code, 'utf8');
  }
});
