const path = require('path');

function pathSort(a, b) {
  a = a.split(path.sep); // eslint-disable-line no-param-reassign
  b = b.split(path.sep); // eslint-disable-line no-param-reassign
  const l = Math.max(a.length, b.length);

  for (let i = 0; i < l; i += 1) {
    if (!(i in a)) return -1;
    if (!(i in b)) return 1;
    if (a[i].toUpperCase() > b[i].toUpperCase()) return 1;
    if (a[i].toUpperCase() < b[i].toUpperCase()) return -1;
  }
  return 0;
}

// this isn't great but we don't have any path info
const aliased = [
  'assets',
  'components',
  'config',
  'library',
  'messages',
  'mutations',
  'queries',
  'routes',
  'schema',
  'styles',
  'subscriptions',
  'types',
  'utils',
];

function isScopedModule({ moduleName }) {
  return moduleName.startsWith('@');
}

function isAliasedModule({ moduleName }) {
  return aliased.some(n => moduleName.startsWith(n));
}

function isCssModule({ moduleName }) {
  return moduleName.includes('.css');
}

const sort = styleApi => {
  const {
    alias,
    and,
    not,
    dotSegmentCount,
    hasNoMember,
    isNodeModule,
    isRelativeModule,
    moduleName,
    unicode,
  } = styleApi;

  const byModuleName = moduleName(pathSort);
  const isAbsoluteModule = and(
    not(isScopedModule),
    not(isAliasedModule),
    not(isRelativeModule),
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
    {
      match: and(isScopedModule, not(isCssModule)),
      sort: byModuleName,
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

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
    { match: and(isScopedModule, isCssModule), sort: byModuleName },
    { match: and(isAliasedModule, isCssModule), sort: byModuleName },
    { match: isCssModule, sort: [dotSegmentCount, byModuleName] },
  ];
};

sort.default = sort;

module.exports = sort;
