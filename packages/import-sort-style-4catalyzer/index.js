// this isn't great but we don't have any path info
const aliased = [
  'components',
  'messages',
  'mutations',
  'queries',
  'routes',
  'schema',
  'subscriptions',
  'utils',
];

function isInternalModule({ moduleName }) {
  return moduleName.startsWith('@qsi/');
}

function isAliasedModule({ moduleName }) {
  return aliased.some(n => moduleName.startsWith(n));
}

function isCssModule({ moduleName }) {
  return moduleName.includes('@qsi/ui-theme') || moduleName.includes('.css');
}

const sort = (styleApi) => {
  const {
    alias,
    and,
    not,
    dotSegmentCount,
    hasNoMember,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = styleApi;

  const byModuleName = moduleName(naturally);
  const isAbsoluteModule = and(
    not(isInternalModule),
    not(isAliasedModule),
    not(isRelativeModule)
  );

  return [
    {
      match: and(isNodeModule, not(isCssModule)),
      sort: byModuleName,
      sortNamedMembers: alias(unicode),
    },
    {
      match: and(isAbsoluteModule, not(isCssModule)),
      sort: byModuleName,
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    {
      match: and(isInternalModule, not(isCssModule)),
      sort: byModuleName,
      sortNamedMembers: alias(unicode),
    },
    {
      match: and(isAliasedModule, not(isCssModule)),
      sort: byModuleName,
      sortNamedMembers: alias(unicode),
    },
    {
      match: and(isRelativeModule, not(isCssModule)),
      sort: [dotSegmentCount, byModuleName],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // finally css
    { match: and(hasNoMember, isCssModule), sort: byModuleName },
    { match: and(isAbsoluteModule, isCssModule), sort: byModuleName },
    { match: and(isInternalModule, isCssModule), sort: byModuleName },
    { match: and(isAliasedModule, isCssModule), sort: byModuleName },
    { match: isCssModule, sort: [dotSegmentCount, byModuleName] },
  ];
};

module.exports = sort;
exports.default = sort;
