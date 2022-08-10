const path = require('path');

module.exports = {
  process(_, filename) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`,
    };
  },
};
