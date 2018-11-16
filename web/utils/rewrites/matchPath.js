/* @flow */

// taken here https://github.com/ReactTraining/react-router

import pathToRegexp from 'path-to-regexp';

const patternCache = {};
const cacheLimit = 10000;
let cacheCount = 0;

const compilePath = (pattern, options) => {
  const cacheKey = `${options.end ? 'true' : 'false'}${
    options.strict ? 'true' : 'false'
  }${options.sensitive ? 'true' : 'false'}`;

  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) return cache[pattern];

  const keys = [];
  const re = pathToRegexp(pattern, keys, options);
  const compiledPattern = { re, keys };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }

  return compiledPattern;
};

type MatchPathResult = {
  path: string,
  url: string,
  isExact: boolean,
  params: { [string]: string },
} | null;
/**
 * Public API for matching a URL pathname to a path pattern.
 */
export const matchPath = (pathname: string, path: string): MatchPathResult => {
  const exact = false;
  const strict = false;
  const sensitive = false;

  const { re, keys } = compilePath(path, { end: exact, strict, sensitive });
  const match = re.exec(pathname);

  if (!match) return null;

  const [url, ...values] = match;
  const isExact = pathname === url;

  if (exact && !isExact) return null;

  return {
    path, // the path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index] || '';
      return memo;
    }, {}),
  };
};
