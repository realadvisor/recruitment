/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/*
 * Minimalistic script runner. Usage example:
 *
 *     node scripts/db.js migrate
 *     Starting 'db-migrate'...
 *     Finished 'db-migrate' in 25ms
 */

function run(task, action, ...args) {
  const command = process.argv[2];
  const taskName =
    command && !command.startsWith('-') ? `${task}-${command}` : task;
  const start = process.hrtime();
  process.stdout.write(`\x1b[2mStarting '${taskName}'...\x1b[0m\n`);
  return Promise.resolve()
    .then(() => action(...args))
    .then(
      () => {
        const end = process.hrtime(start);
        const time = (end[0] + end[1] / 1000000000).toFixed(2);
        process.stdout.write(
          `\x1b[2mFinished '${taskName}' after ${time}s\x1b[0m\n`,
        );
      },
      err => {
        process.stderr.write(`${err.stack}\n`);
        process.exit(1);
      },
    );
}

process.nextTick(() => {
  if (typeof require.main.exports === 'function') {
    require.main.exports();
  }
});

module.exports = (task, action) => run.bind(undefined, task, action);
