/* @flow */
/* eslint-disable no-console, no-shadow, import/first */

import './env';
import app from './app';
import db from './db_';

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`API is listening on http://localhost:${port}/`);
});

function handleExit(options, err) {
  if (options.cleanup) {
    const actions = [server.close, db.destroy];
    actions.forEach((close, i) => {
      try {
        close(() => {
          if (i === actions.length - 1) process.exit();
        });
      } catch (err) {
        if (i === actions.length - 1) process.exit();
      }
    });
  }
  if (err) console.error(err);
  if (options.exit) process.exit();
}

process.on('exit', handleExit.bind(null, { cleanup: true }));
process.on('SIGINT', handleExit.bind(null, { exit: true }));
process.on('SIGTERM', handleExit.bind(null, { exit: true }));
process.on('uncaughtException', handleExit.bind(null, { exit: true }));

export default server;
