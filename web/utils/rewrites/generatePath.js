/* @flow */

// taken here https://github.com/ReactTraining/react-router

import pathToRegexp from 'path-to-regexp';

const patternCache = {};
const cacheLimit = 10000;
let cacheCount = 0;

const compileGenerator = pattern => {
  const cacheKey = pattern;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) return cache[pattern];

  const compiledGenerator = pathToRegexp.compile(pattern);

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledGenerator;
    cacheCount++;
  }

  return compiledGenerator;
};

/**
 * Public API for generating a URL pathname from a pattern and parameters.
 */
export const generatePath = (
  pattern: string = '/',
  params: Object = {}
): string => {
  if (pattern === '/') {
    return pattern;
  }
  const generator = compileGenerator(pattern);

  const cleanParams = Object.keys(params).reduce(
    (r, k) => ({ ...r, [k]: params[k] === '' ? undefined : params[k] }),
    {}
  );

  return generator(cleanParams, { pretty: true });
};

export default generatePath;
