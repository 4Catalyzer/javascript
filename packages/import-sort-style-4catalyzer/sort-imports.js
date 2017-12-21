#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const minimatch = require('minimatch');
const { sortImports } = require('import-sort');
const parser = require('import-sort-parser-babylon');
const yargs = require('yargs');

const style = require('./index.js');

const cwd = process.cwd();
const argv = yargs
  .usage('$0 [args]')
  .array('ignore')
  .array('pattern')
  .help()
  .argv;

// used as a reference:
// https://github.com/babel/babel/blob/master/packages/babel-core/src/util.js
const ignoreFiles = (argv.ignore || []).map((val) => {
  let cleanVal = val;
  // remove starting wildcards or relative separator if present
  if (val.startsWith('./') || val.startsWith('*/')) cleanVal = val.slice(2);
  if (val.startsWith('**/')) cleanVal = val.slice(3);

  const regex = minimatch.makeRe(cleanVal, { nocase: true });
  return new RegExp(regex.source.slice(1, -1), 'i');
});

let files = argv._;
if (argv.pattern) {
  files = argv.pattern.reduce((a, pattern) => (
    a.concat(glob.sync(`${pattern}/**/*js`, { absolute: true }))
  ), files);
}

files.forEach((file) => {
  if (ignoreFiles.some(r => !!file.match(r))) return;

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
