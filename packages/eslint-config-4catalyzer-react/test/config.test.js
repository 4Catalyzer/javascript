const pick = require('lodash/pick');

const config = require('..');
const configTester = require('../../../tools/config-tester');

describe('react-config', () => {
  it('sorts components correctly', () => {
    const result = configTester(
      {
        ...config,
        rules: pick(config.rules, 'react/sort-comp'),
      },
      `
import React from 'react';

class Foo extends React.Component {
  bing: boolean;

  foo: number = 1;

  constructor() {
    super();
    this.foo = true;
  }

  updateBar = () => {
    const { foo } = this;
    return foo;
  }

  updateBay() {
    return this.foo;
  }

  updateBaz = () => {
    const { foo } = this;
    return foo;
  }

  render() {
    return <div />;
  }
}

export default Foo;
`.trimStart(),
    );

    expect(result.errorCount).toEqual(0);
  });
});
