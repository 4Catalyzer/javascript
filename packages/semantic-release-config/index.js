module.exports = {
  analyzeCommits: {
    preset: 'angular',
    releaseRules: [{ type: 'breaking', release: 'major' }],
  },

  // no verify for npm, semantic-release-alt-publish-dir will run it internally
  verifyConditions: [
    '@semantic-release/changelog',
    '@4c/semantic-release-alt-publish-dir',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
  prepare: [
    '@semantic-release/changelog',
    '@4c/semantic-release-alt-publish-dir',
    '@semantic-release/npm',
    '@semantic-release/git',
  ],
};
