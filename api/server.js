/* eslint-disable global-require, strict, import/no-extraneous-dependencies, import/no-unresolved */

'use strict';

if (process.env.NODE_ENV === 'production') {
  // Launch the app directly in production environment
  require('source-map-support').install();
  require('./build/server');
} else {
  // Otherwise, built it from source and launch
  // on http://localhost:8080/ with "live reload"
  require('source-map-support').install();
  const cp = require('child_process');
  const restart = require('restart');
  const build = require('./scripts/build');
  cp.spawnSync('docker-compose', ['up', '-d'], { stdio: 'inherit' });
  build({
    watch: true,
    onComplete: () => restart('./build/server'),
  });
}
