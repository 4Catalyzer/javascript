import { transformSync } from '@babel/core';
import stripIndent from 'strip-indent';

import intlPreset from '../intl-preset';

describe('intl tests', () => {
  test.each([
    [
      'define messages',
      {
        code: `
            import { defineMessages } from 'react-intl';

            const messages = defineMessages({
              title: {
                id: 'title',
              },
              body: {
                id: 'body',
              },
            });

            export { messages };
          `,
        output: `
            import { defineMessages } from 'react-intl';
            const messages = defineMessages({
              title: {
                "id": "@4c/babel-preset:title"
              },
              body: {
                "id": "@4c/babel-preset:body"
              }
            });
            export { messages };
          `,
      },
    ],

    [
      'FormattedMessages',
      {
        code: `
            import { FormattedMessage } from 'react-intl';

            <FormattedMessage id="title" />;
          `,
        output: `
            import { FormattedMessage } from 'react-intl';

            /*#__PURE__*/
            React.createElement(FormattedMessage, {
              id: "@4c/babel-preset:title"
            });

          `,
      },
    ],
    [
      'intl.formatMessage',
      {
        options: {
          extractFromFormatMessageCall: true,
        },
        code: `
            const intl = useIntl()

            intl.formatMessage({
              id: "title"
            })
          `,
        output: `
            const intl = useIntl();
            intl.formatMessage({
              "id": "@4c/babel-preset:title"
            });
          `,
      },
    ],

    [
      'provided prefix',
      {
        options: {
          prefix: 'cool-pkg',
        },
        code: `
            import { defineMessages } from 'react-intl';

            const messages = defineMessages({
              title: {
                id: 'title',
              },
            });

            export { messages };
          `,
        output: `
            import { defineMessages } from 'react-intl';
            const messages = defineMessages({
              title: {
                "id": "cool-pkg:title"
              }
            });
            export { messages };
          `,
      },
    ],
  ])('%s', (name, { code, output, options = {} }) => {
    const result = transformSync(stripIndent(code), {
      filename: 'foo.js',
      presets: ['@babel/react', [intlPreset, options]],
    }).code;

    expect(result.trim()).toEqual(stripIndent(output).trim());
  });
});
