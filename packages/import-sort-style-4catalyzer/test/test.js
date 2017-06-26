const { sortImports } = require('import-sort');
const parser = require('import-sort-parser-babylon');
const fs = require('fs');

const style = require('../index.js');


const code = fs.readFileSync(`${__dirname}/fixtures/file.js`, 'utf8');

const sorted = sortImports(
  code,
  parser,
  style
);

console.log(sorted.code);
