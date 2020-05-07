remove-ember-classic-decorator-codemod
==============================================================================

Simlpe codemod that removes @classic decorator and converts init hook to constructor

**This codemod is experimental and might break your app. Make sure to
review the changes that it creates!**


Usage
------------------------------------------------------------------------------

```bash
npx remove-ember-classic-decorator-codemod
```


Example
------------------------------------------------------------------------------

```js
import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class MyComponent extends Component {
    init() {
      super.init(...arguments);
    }
    ...
});
```

will be converted to:

```js
import Component from '@ember/component';

export default class MyComponent extends Component {
    constructor() {
      super(...arguments);
    }
    ...
});
```

Configuration
------------------------------------------------------------------------------

### Paths

You may pass alternative paths or globs as arguments:

```bash
# process one file only
npx remove-ember-classic-decorator-codemod app/components/my-component.js

# process a file and all files under it's namespace
npx remove-ember-classic-decorator-codemod app/components/my-component.js app/components/my-component/

# process all files matching a glob
npx remove-ember-classic-decorator-codemod app/components/**/foo-*.js
```

Known Caveats
------------------------------------------------------------------------------

- Due to the way `jscodeshift` works it sometimes removes empty lines between
  component properties, or adds new ones unexpectedly.

License
------------------------------------------------------------------------------

This projects is released under the [MIT License](LICENSE.md).
