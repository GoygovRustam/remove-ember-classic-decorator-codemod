const { transform } = require('../transform');

function generateSnapshot(source) {
  let result = transform(source);

  return `
========== INITIAL ============
${source}
=========== RESULT ============
${result}
_____________________________________________
`;
}

describe('Basic', () => {
  test('import statement and classic decorator', () => {
    let source = `
      import classic from 'ember-classic-decorator';
      import Component from '@ember/component';

      @classic
      export default class TestComponent extends Component {
      }
  `;

    expect(generateSnapshot(source)).toMatchSnapshot();
  });

  test('only init hook', () => {
    let source = `
      import Component from '@ember/component';

      export default class TestComponent extends Component {
          init() {
            super.init(...arguments)
          }
      }
  `;

    expect(generateSnapshot(source)).toMatchSnapshot();
  });

  test('import statement, classic decorator and init hook', () => {
    let source = `
      import classic from 'ember-classic-decorator';
      import Component from '@ember/component';

      @classic
      export default class TestComponent extends Component {
          init() {
            super.init(...arguments)
          }
      }
  `;

    expect(generateSnapshot(source)).toMatchSnapshot();
  });

  test('init hook with no arguments', () => {
    let source = `
      import Component from '@ember/component';

      export default class TestComponent extends Component {
          init() {
            super.init()
          }
      }
  `;

    expect(generateSnapshot(source)).toMatchSnapshot();
  });

  test('init hook with custom arguments', () => {
    let source = `
      import Component from '@ember/component';

      export default class TestComponent extends Component {
          init() {
            super.init(a, b, c)
          }
      }
  `;

    expect(generateSnapshot(source)).toMatchSnapshot();
  });

  test('already converted', () => {
    let source = `
      import Component from '@ember/component';

      export default class TestComponent extends Component {
          constructor() {
            super(a, b, c)
          }
      }
  `;

    expect(generateSnapshot(source)).toMatchSnapshot();
  });

  test('import statement, classic decorator and init hook when multiple decorators exist', () => {
    let source = `
      import classic from 'ember-classic-decorator';
      import Component from '@ember/component';

      @testDecorator
      @classic
      @anotherTestDecorator
      export default class TestComponent extends Component {
          init() {
            super.init(...arguments)
          }
      }
  `;

    expect(generateSnapshot(source)).toMatchSnapshot();
  });
});
