/* eslint-disable no-param-reassign */
const { TSESLint } = require('@typescript-eslint/experimental-utils');

const rule = require('../rules/expect');

class RuleTester extends TSESLint.RuleTester {
  constructor() {
    super({
      parserOptions: {
        ecmaVersion: 6,
        tsconfigRootDir: `${__dirname}/fixtures`,
        project: ['./tsconfig.json'],
      },
      parser: require.resolve('@typescript-eslint/parser'),
    });
  }

  run(name, r, tests) {
    tests.valid = tests.valid.map(t => ({
      ...t,
      filename: t.filename || `${__dirname}/fixtures/file.ts`,
    }));
    tests.invalid = tests.invalid.map(t => ({
      ...t,
      filename: t.filename || `${__dirname}/fixtures/file.ts`,
    }));
    super.run(name, r, tests);
  }
}

const ruleTester = new RuleTester();

ruleTester.run('expect', rule, {
  valid: [
    {
      code: `
        type Foo = { bar: number };

        // $ExpectError
        const foo: Foo  = { bar: '' };
      `,
    },
    {
      code: `
        type Foo = { bar: number };
        const foo: Foo  = { bar: '' }; // $ExpectError
      `,
    },
    {
      code: `
        // $ExpectType 1
        const foo = 1
      `,
    },
    {
      code: `
        declare const ar: readonly number[];
        ar; // $ExpectType ReadonlyArray<number>
      `,
    },
  ],

  invalid: [
    {
      code: `
        type Foo = { bar: number };

        // $ExpectError
        const foo: Foo  = { bar: 3 };
      `,

      errors: [
        {
          messageId: 'expectedError',
          line: 4,
        },
      ],
    },
    {
      code: `
        type Foo = { bar: number };
        const foo: Foo  = { bar: 3 };  // $ExpectError
      `,
      errors: [
        {
          messageId: 'expectedError',
          line: 3,
        },
      ],
    },
    {
      code: `
        // $ExpectType number
        const foo = ''
      `,
      errors: [
        {
          messageId: 'wrongType',
          data: {
            expected: 'number',
            actual: '""',
          },
          line: 3,
        },
      ],
    },
  ],
});
