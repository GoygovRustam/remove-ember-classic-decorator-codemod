function isDecorator(path, name) {
  let node = path.value;
  let isCall =
    node.expression.type === 'CallExpression' && node.expression.callee.type === 'Identifier';

  return (
    node.type === 'Decorator' &&
    ((isCall && node.expression.callee.name === name) || (!isCall && node.expression.name === name))
  );
}

module.exports = {
  isDecorator,
};
