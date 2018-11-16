#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const del = require('del');
const babel = require('@babel/core');
const chokidar = require('chokidar');
const makeDir = require('make-dir');

const compile = file => {
  const dest = `build/${path.relative('src', file)}`;
  makeDir.sync(path.dirname(dest));

  if (file.endsWith('.js')) {
    const { code, map } = babel.transformFileSync(file, {
      sourceMaps: true,
      sourceFileName: path.relative(
        path.dirname(`build${file.substr(3)}`),
        file,
      ),
    });
    // Enable source maps
    const data =
      code + (map ? `\n//# sourceMappingURL=${path.basename(file)}.map\n` : '');
    fs.writeFileSync(dest, data, 'utf8');
    console.info(file, '->', dest);
    if (map) fs.writeFileSync(`${dest}.map`, JSON.stringify(map), 'utf8');
  } else {
    const data = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(dest, data, 'utf8');
    console.info(file, '->', dest);
  }
};

/**
 * Compiles the app from source code. Note, that one of the design
 * goals of this script is to provide a consistent way of building
 * the app for testing (yarn start) and for production (yarn build).
 */
function build({ watch = false, onComplete } = {}) {
  // Clean up the output directory
  del.sync(['build/**', '!build'], { dot: true });

  const watcher = chokidar.watch(['src', 'package.json', 'yarn.lock'], {
    ignored: ['**/__tests__', '**/__tests__/**', '**/*.test.js'],
    persistent: watch,
    awaitWriteFinish: { stabilityThreshold: 500 },
  });

  const done = (() => {
    let timeout;
    let timeoutMs = 1000;
    const updateScript = './scripts/update-schema';
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (watch) {
          cp.spawn('node', [updateScript], { stdio: 'inherit' });
        } else {
          cp.spawnSync('node', [updateScript], { stdio: 'inherit' });
        }
        if (onComplete) onComplete();
        if (!watch) watcher.close();
        timeoutMs = 200;
      }, timeoutMs);
    };
  })();

  watcher.on('all', (event, src) => {
    // Reload the app if package.json, yarn.lock or locales have changed (in watch mode)
    if (src === 'package.json' || src === 'yarn.lock') {
      done();
      return;
    }

    try {
      if (event === 'add' || event === 'change') {
        // Create or update a file inside the output (build) folder
        if (src.startsWith('src')) compile(src);
        done();
      }

      if (event === 'unlinkDir') {
        // Get destination file name, e.g. src/app.js (src) -> build/app.js (dest)
        const dest = src.startsWith('src')
          ? `build/${path.relative('src', src)}`
          : `build/${src}`;
        // Remove directory if it was removed from the source folder
        if (fs.existsSync(dest)) fs.rmdirSync(dest);
      }
    } catch (err) {
      console.error(err.message);
    }
  });

  watcher.once('error', console.error);
  watcher.once('ready', done);

  function cleanup() {
    if (watcher) watcher.close();
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}

module.exports = build;

if (require.main.exports === build) {
  build();
}
