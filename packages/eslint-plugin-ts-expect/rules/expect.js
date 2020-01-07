/* Code, in part, from https://github.com/microsoft/dtslint/commit/5f7605cea35054286c1dce02e5cb081ee350f16a */

/* eslint-disable no-param-reassign */

const { ESLintUtils } = require('@typescript-eslint/experimental-utils');
const ts = require('typescript');

const createRule = ESLintUtils.RuleCreator(() => `fasfasfas`);

const lineFromPosition = (pos, sourceFile) =>
  sourceFile.getLineAndCharacterOfPosition(pos).line;

function matchReadonlyArray(actual, expected) {
  if (!(/\breadonly\b/.test(actual) && /\bReadonlyArray\b/.test(expected)))
    return false;
  const readonlyArrayRegExp = /\bReadonlyArray</y;
  const readonlyModifierRegExp = /\breadonly /y;

  // A<ReadonlyArray<B<ReadonlyArray<C>>>>
  // A<readonly B<readonly C[]>[]>

  let expectedPos = 0;
  let actualPos = 0;
  let depth = 0;
  while (expectedPos < expected.length && actualPos < actual.length) {
    const expectedChar = expected.charAt(expectedPos);
    const actualChar = actual.charAt(actualPos);
    if (expectedChar === actualChar) {
      expectedPos++;
      actualPos++;
      continue;
    }

    // check for end of readonly array
    if (
      depth > 0 &&
      expectedChar === '>' &&
      actualChar === '[' &&
      actualPos < actual.length - 1 &&
      actual.charAt(actualPos + 1) === ']'
    ) {
      depth--;
      expectedPos++;
      actualPos += 2;
      continue;
    }

    // check for start of readonly array
    readonlyArrayRegExp.lastIndex = expectedPos;
    readonlyModifierRegExp.lastIndex = actualPos;
    if (
      readonlyArrayRegExp.test(expected) &&
      readonlyModifierRegExp.test(actual)
    ) {
      depth++;
      expectedPos += 14; // "ReadonlyArray<".length;
      actualPos += 9; // "readonly ".length;
      continue;
    }

    return false;
  }
  return true;
}

/**
 * Try to retrieve typescript parser service from context
 */
function getParserServices(context) {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    throw new Error(
      'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.',
    );
  }
  return context.parserServices;
}

function getNodeForExpectType(node) {
  if (node.kind === ts.SyntaxKind.VariableStatement) {
    // ts2.0 doesn't have `isVariableStatement`
    const {
      declarationList: { declarations },
    } = node;
    if (declarations.length === 1) {
      const { initializer } = declarations[0];
      if (initializer) {
        return initializer;
      }
    }
  }
  return node;
}

function getExpectTypeFailures(sourceFile, typeAssertions, checker) {
  const unmetExpectations = [];
  // Match assertions to the first node that appears on the line they apply to.
  // `forEachChild` isn't available as a method in older TypeScript versions, so must use `ts.forEachChild` instead.
  ts.forEachChild(sourceFile, function iterate(node) {
    const line = lineFromPosition(node.getStart(sourceFile), sourceFile);
    const expected = typeAssertions.get(line);
    if (expected !== undefined) {
      // https://github.com/Microsoft/TypeScript/issues/14077
      if (node.kind === ts.SyntaxKind.ExpressionStatement) {
        node = node.expression;
      }

      const type = checker.getTypeAtLocation(getNodeForExpectType(node, ts));

      const actual = type
        ? checker.typeToString(
            type,
            /* enclosingDeclaration */ undefined,
            ts.TypeFormatFlags.NoTruncation,
          )
        : '';

      if (
        !expected
          .split(/\s*\|\|\s*/)
          .some(s => actual === s || matchReadonlyArray(actual, s))
      ) {
        unmetExpectations.push({ node, expected, actual });
      }

      typeAssertions.delete(line);
    }

    ts.forEachChild(node, iterate);
  });
  return { unmetExpectations, unusedAssertions: typeAssertions.keys() };
}

module.exports = createRule({
  name: 'expect',
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Asserts types with $ExpectType and presence of errors with $ExpectError.',
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      expectedError: 'Expected an error on this line, but found none.',
      wrongType: 'Expected type to be:\n  {{expected}}\ngot:\n  {{actual}}',
    },
    type: 'problem',
  },

  create(context) {
    const src = context.getSourceCode();

    const parserServices = getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    const tsSource = parserServices.program.getSourceFile(
      context.getFilename(),
    );

    const diagnostics = ts.getPreEmitDiagnostics(
      parserServices.program,
      tsSource,
    );

    function getLine(comment) {
      const { line } = comment.loc.start;
      const text = String(src.lines[line - 1]);
      const preamble = text.slice(0, comment.loc.start.column).trim();

      // if its first on the line then it applies to the line below
      return !preamble ? line : line - 1;
    }

    function parseAssertions(comments) {
      const errorLines = new Map();
      const typeAssertions = new Map();
      const duplicates = [];

      comments.forEach(comment => {
        const match = /^ \$Expect((Type (.*))|Error)$/.exec(comment.value);
        if (match === null) {
          return;
        }

        const line = getLine(comment);

        if (match[1] === 'Error') {
          if (errorLines.has(line)) {
            duplicates.push(line);
          }
          errorLines.set(line, comment);
        } else {
          const expectedType = match[3];
          // Don't bother with the assertion if there are 2 assertions on 1 line. Just fail for the duplicate.
          if (typeAssertions.delete(line)) {
            duplicates.push(line);
          } else {
            typeAssertions.set(line, expectedType);
          }
        }
      });

      return { errorLines, typeAssertions, duplicates };
    }

    return {
      Program() {
        const comments = src.getAllComments();
        const { errorLines, typeAssertions } = parseAssertions(comments);

        const seenDiagnosticsOnLine = new Set();
        for (const diagnostic of diagnostics) {
          seenDiagnosticsOnLine.add(
            lineFromPosition(diagnostic.start, tsSource),
          );
        }

        for (const [line, comment] of errorLines) {
          if (!seenDiagnosticsOnLine.has(line)) {
            context.report({
              messageId: 'expectedError',
              node: comment,
            });
          }
        }

        const { unmetExpectations } = getExpectTypeFailures(
          tsSource,
          typeAssertions,
          checker,
        );

        for (const { node, expected, actual } of unmetExpectations) {
          context.report({
            messageId: 'wrongType',
            data: {
              expected,
              actual,
            },
            node: src.getNodeByRangeIndex(node.getStart(tsSource)),
          });
        }
      },
    };
  },
});
