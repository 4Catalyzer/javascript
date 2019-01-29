/* eslint-disable prefer-template */
const traverse = require('@babel/traverse').default;
const {
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isImportSpecifier,
} = require('@babel/types');
const { parse } = require('@babel/core');
const findLineColumn = require('find-line-column');

function formatNamedMembers(
  namedMembers,
  useMultipleLines,
  useSpaces,
  useTrailingComma,
  prefix,
  eol = '\n',
) {
  if (useMultipleLines) {
    return (
      '{' +
      eol +
      namedMembers
        .map(({ name, alias }, index) => {
          const lastImport = index === namedMembers.length - 1;
          const comma = !useTrailingComma && lastImport ? '' : ',';

          if (name === alias) {
            return `${prefix}${name}${comma}` + eol;
          }

          return `${prefix}${name} as ${alias}${comma}` + eol;
        })
        .join('') +
      '}'
    );
  }

  const space = useSpaces ? ' ' : '';
  const comma = useTrailingComma ? ',' : '';

  return (
    '{' +
    space +
    namedMembers
      .map(({ name, alias }) => {
        if (name === alias) {
          return `${name}`;
        }

        return `${name} as ${alias}`;
      })
      .join(', ') +
    comma +
    space +
    '}'
  );
}

function parseImports(code, options) {
  const parsed = parse(code, {
    code: false,
    sourceType: 'module',
    parserOpts: options,
  });

  const imports = [];
  const ignore = (parsed.comments || []).some(comment =>
    comment.value.match(/\simport-sort-ignore\s/g),
  );

  if (ignore) return imports;

  traverse(parsed, {
    ImportDeclaration(path) {
      if (ignore) return;
      const { node } = path;

      const importStart = node.start;
      const importEnd = node.end;

      let start = importStart;
      let end = importEnd;

      if (node.leadingComments) {
        const comments = node.leadingComments;

        let current = node.leadingComments.length - 1;
        let previous;

        while (comments[current] && comments[current].end + 1 === start) {
          if (
            code
              .substring(comments[current].start, comments[current].end)
              .indexOf('#!') === 0
          ) {
            break;
          }

          // TODO: Improve this so that comments with leading whitespace are allowed
          if (findLineColumn(code, comments[current].start).col !== 0) {
            break;
          }

          previous = current;
          start = comments[previous].start; // eslint-disable-line
          current--;
        }
      }

      if (node.trailingComments) {
        const comments = node.trailingComments;

        let current = 0;
        let previous;

        while (comments[current] && comments[current].start - 1 === end) {
          if (comments[current].loc.start.line !== node.loc.start.line) {
            break;
          }

          previous = current;
          end = comments[previous].end; // eslint-disable-line
          current++;
        }
      }

      const imported = {
        start,
        end,

        importStart,
        importEnd,

        moduleName: node.source.value,

        type: node.importKind === 'type' ? 'import-type' : 'import',
        namedMembers: [],
      };

      if (node.specifiers) {
        node.specifiers.forEach(specifier => {
          if (isImportSpecifier(specifier)) {
            imported.namedMembers.push({
              name: specifier.imported.name,
              alias: specifier.local.name,
            });
          } else if (isImportDefaultSpecifier(specifier)) {
            imported.defaultMember = specifier.local.name;
          } else if (isImportNamespaceSpecifier) {
            imported.namespaceMember = specifier.local.name;
          }
        });
      }

      imports.push(imported);
    },
  });

  return imports;
}

function formatImport(code, imported, eol = '\n') {
  const importStart = imported.importStart || imported.start;
  const importEnd = imported.importEnd || imported.end;

  const importCode = code.substring(importStart, importEnd);

  const { namedMembers } = imported;

  if (namedMembers.length === 0) {
    return code.substring(imported.start, imported.end);
  }

  const newImportCode = importCode.replace(
    /\{[\s\S]*\}/g,
    namedMembersString => {
      const useMultipleLines = namedMembersString.indexOf(eol) !== -1;

      let prefix;

      if (useMultipleLines) {
        prefix = namedMembersString.split(eol)[1].match(/^\s*/)[0]; // eslint-disable-line
      }

      const useSpaces = namedMembersString.charAt(1) === ' ';

      const userTrailingComma = namedMembersString
        .replace('}', '')
        .trim()
        .endsWith(',');

      return formatNamedMembers(
        namedMembers,
        useMultipleLines,
        useSpaces,
        userTrailingComma,
        prefix,
        eol,
      );
    },
  );

  return (
    code.substring(imported.start, importStart) +
    newImportCode +
    code.substring(importEnd, importEnd + (imported.end - importEnd))
  );
}

module.exports = ({ typescript = false } = {}) => {
  const parserOpts = {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    sourceType: 'unambiguous',
    sourceFilename: true,
    plugins: [
      'jsx',
      typescript ? 'typescript' : 'flow',
      'flowComments',
      'doExpressions',
      'objectRestSpread',
      ['decorators', { decoratorsBeforeExport: true }],
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'asyncGenerators',
      'functionBind',
      'functionSent',
      'dynamicImport',
      'numericSeparator',
      'optionalChaining',
      'importMeta',
      'bigInt',
      'optionalCatchBinding',
      'throwExpressions',
      ['pipelineOperator', { proposal: 'minimal' }],
      'nullishCoalescingOperator',
    ],
  };

  return {
    formatImport,
    parseImports: code => parseImports(code, parserOpts),
  };
};
