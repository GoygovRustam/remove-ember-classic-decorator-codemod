const fs = require('fs');
const j = require('jscodeshift').withParser('ts');
const { isDecorator } = require('./utils');

function transformPath(path) {
  let source = fs.readFileSync(path, 'utf8');

  let result = transform(source);

  if (result) {
    fs.writeFileSync(path, result, 'utf8');
  }

  return result;
}

function transform(source) {
  let root = j(source);

  const classDeclaration = root.find(j.ClassDeclaration);

  let decorators = classDeclaration.get('decorators');

  // Find @classic decorator
  let classicDecorator =
    decorators.value && decorators.filter(path => isDecorator(path, 'classic'));

  // Remove @classic decorator
  if (classicDecorator && classicDecorator.length > 0) {
    j(classicDecorator[0]).remove();
  }

  // Find ember classic decorator import
  const importDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: 'ember-classic-decorator',
    },
  });

  // Remove ember classic decorator import
  if (importDeclaration && importDeclaration.length) {
    importDeclaration.remove();
  }

  // Find init hook
  const initMehod = root.find(j.ClassMethod, {
    key: {
      name: 'init',
    },
  });

  if (initMehod && initMehod.length) {
    // Replace init hook with constructor
    initMehod.replaceWith(nodePath => {
      const { node } = nodePath;

      node.key.name = 'constructor';
      return node;
    });

    // Find super.init(...)
    const superInit = root.find(j.MemberExpression, {
      property: {
        name: 'init',
      },
    });

    // Replace super.init(...) with super(...)
    superInit.replaceWith(nodePath => {
      const { node } = nodePath;

      return node.object;
    });
  }

  return root.toSource();
}

module.exports = {
  transformPath,
  transform,
};
