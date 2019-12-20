import babelPluginTester from 'babel-plugin-tester';
import namespacePlugin from '../namespace-plugin';

babelPluginTester({
  plugin: namespacePlugin,
  pluginName: 'namespacePlugin',
  snapshot: false,
  fixtures: false,
  babelOptions: {
    filename: 'foo.js',
    presets: ['@babel/react'],
  },
  tests: {
    'define messages': {
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
              id: '@4c/babel-preset:title',
            },
            body: {
              id: '@4c/babel-preset:body',
            },
          });
          export { messages };
        `,
    },

    FormattedMessages: {
      code: `
          import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

          <FormattedMessage id="title" />;
          <FormattedHTMLMessage id="body" />;
        `,
      output: `
          import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
          React.createElement(FormattedMessage, {
            id: '@4c/babel-preset:title',
          });
          React.createElement(FormattedHTMLMessage, {
            id: '@4c/babel-preset:body',
          });
        `,
    },
    'intl.formatMessage': {
      code: `
          const intl = useIntl()

          intl.formatMessage({
            id: "title"
          })
        `,
      output: `
          const intl = useIntl();
          intl.formatMessage({
            id: '@4c/babel-preset:title',
          });
        `,
    },

    'provided prefix': {
      pluginOptions: {
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
              id: 'cool-pkg:title',
            },
          });
          export { messages };
        `,
    },
    'quoted strings': {
      code: `
          const intl = useIntl()

          intl.formatMessage({
            "id": "title"
          })
        `,
      output: `
          const intl = useIntl();
          intl.formatMessage({
            id: '@4c/babel-preset:title',
          });
        `,
    },
  },
});
