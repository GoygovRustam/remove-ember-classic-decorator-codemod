const pkgDir = require('pkg-dir');
const globby = require('globby');
const chalk = require('chalk');

const { transformPath } = require('./transform');

async function run(argv) {
  let patterns = argv.slice(2);
  if (patterns.length !== 0) {
    await runForGlobs(patterns, process.cwd());
  } else {
    let baseDir = await pkgDir();
    await runForPath(baseDir);
  }
}

async function runForPath(path) {
  let patterns = ['app/**/*.js', 'addon/**/*.js'];
  await runForGlobs(patterns, path);
}

async function runForGlobs(patterns, cwd) {
  console.log(` 🔍  Searching for files...`);

  let paths = await globby(patterns, {
    cwd,
    expandDirectories: {
      extensions: ['js'],
    },
  });

  // Iterate over all the paths and convert each
  for (let path of paths) {
    try {
      let result = transformPath(path);
      if (result) {
        console.log(
          chalk.green(`${chalk.dim(path)}: @classic removed. "init" renamed to "constructor".`)
        );
      } else {
        console.log(`${chalk.dim(path)}: something went wrong.. file skipped`);
      }
    } catch (error) {
      console.log(chalk.red(`${chalk.dim(path)}: ${error.stack}`));
    }
  }

  console.log(chalk.green(`Done! `));
}

module.exports = { run };
