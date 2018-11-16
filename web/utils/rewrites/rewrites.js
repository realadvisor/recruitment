/* @flow */

import memoize from 'fast-memoize';
import pathToRegexp from 'path-to-regexp';
import invariant from 'tiny-invariant';
import { matchPath } from './matchPath';
import { generatePath } from './generatePath';
import { joinURL } from './joinUrl';
import { parse, format } from './url';

const findRewriteAndMatch = (rewrites, pathname) => {
  for (let i = 0; i !== rewrites.length; ++i) {
    const match = matchPath(pathname, rewrites[i].path);

    if (match) {
      const { exclude } = rewrites[i];
      const { params } = match;
      if (params && exclude) {
        if (
          Object.keys(params).some(key => {
            const excludes = exclude[key];

            if (excludes != null) {
              return Boolean(
                exclude[key].find(
                  excl =>
                    typeof excl === 'string'
                      ? excl.endsWith('*') && params[key] != null
                        ? params[key].startsWith(excl.slice(0, -1))
                        : excl === params[key]
                      : excl(params[key])
                )
              );
            }
          })
        ) {
          continue;
        }
      }

      return {
        rewrite: rewrites[i],
        match,
      };
    }
  }
  return null;
};

// converts url like /products/1 to products?id=1 based on rewrites table
export const toPageHref = (
  rewrites: $ReadOnlyArray<{|
    path: string,
    page: string,
    exclude?: {
      [string]: $ReadOnlyArray<string | (string => boolean)>,
    },
  |}>,
  pUrl: string,
  localExec?: boolean
): {| pathname: string, query: {} |} | null => {
  const { pathname, query } = parse(pUrl);
  if (pathname == null) throw new Error('pathname cantbe null');

  const rMatch = findRewriteAndMatch(rewrites, pathname);
  if (rMatch == null) {
    return null;
  }

  const {
    rewrite: { page },
    match: { params, url },
  } = rMatch;

  invariant(pathname.startsWith(url), 'rewrite rule not supported');

  const newPathname = joinURL(`/${page}`, pathname.substr(url.length));
  const decodedParams = Object.keys(params).reduce(
    (r, k) => ({
      ...r,
      [k]: params[k] != null ? decodeURIComponent(params[k]) : undefined,
    }),
    {}
  );

  const result = {
    pathname: newPathname === '' ? '/' : newPathname,
    query: { ...decodedParams, ...query },
  };

  // pathname
  if (page === '') {
    if (localExec === true) {
      throw new Error('Possible inifinite loop, check your rewrites');
    }
    // apply rules twice
    const nextResult = toPageHref(rewrites, format(result), true);
    return nextResult || result;
  }

  return result;
};

type ObjHref = { +pathname: string, +query?: {} };

type Href = $Exact<ObjHref> | string;

type PreparedRewrites = $ReadOnlyArray<{|
  keys: { [string]: true },
  path: string,
  page: string,
|}>;

const prepareRewrites = memoize(
  (
    rewrites: $ReadOnlyArray<{
      path: string,
      page: string,
    }>
  ): PreparedRewrites => {
    return rewrites.map(r => {
      const keys: $ReadOnlyArray<{ name: string }> = [];
      pathToRegexp(r.path, keys);
      return {
        ...r,
        keys: keys.reduce((r, key) => ({ ...r, [key.name]: true }), {}),
      };
    });
  }
);

// converts url like products?id=1 to /products/1 based on rewrites table
export const toAsUrl = (
  rewritesBase: $ReadOnlyArray<{|
    path: string,
    page: string,
    exclude?: {
      [string]: $ReadOnlyArray<string | (string => boolean)>,
    },
  |}>,
  peekKeysFromCurrentRoute: $ReadOnlyArray<string>,
  pageHref: Href,
  currentRoute: ObjHref
) => {
  const rewrites = prepareRewrites(rewritesBase);

  const { pathname, query } =
    typeof pageHref === 'string'
      ? toPageHref(rewritesBase, pageHref) || parse(pageHref)
      : pageHref;

  const currentRoutePickedQuery = peekKeysFromCurrentRoute.reduce(
    (r, key) =>
      currentRoute &&
      currentRoute.query &&
      currentRoute.query[key] &&
      (query == null || !(key in query))
        ? {
            ...r,
            [key]: currentRoute.query[key],
          }
        : r,
    {}
  );

  if (pathname == null) return null;

  const combinedQuery = {
    ...currentRoutePickedQuery,
    ...(query != null
      ? Object.keys(query).reduce(
          (r, k) => (query[k] === null ? r : { ...r, [k]: query[k] }),
          {}
        )
      : null),
  };

  const samePageRewrites = rewrites
    .filter(r => pathname.startsWith(`/${r.page}`))
    .filter(r => Object.keys(r.keys).every(k => k in combinedQuery));

  if (samePageRewrites.length === 0) {
    return {
      href: {
        pathname,
        query: combinedQuery,
      },
      as: format({ pathname, query: combinedQuery }),
    };
  }

  const rewriteCombinedKeys = samePageRewrites.reduce(
    (r, { keys }) => ({ ...r, ...keys }),
    {}
  );

  let asPathName = samePageRewrites.reduce((r, rewrite) => {
    const gPath = generatePath(rewrite.path, combinedQuery);
    const asPathName = joinURL(gPath, r);
    return asPathName;
  }, pathname.substr(samePageRewrites[0].page.length + 1));
  if (!asPathName.startsWith('/')) {
    asPathName = `/${asPathName}`;
  }

  return {
    href: {
      pathname,
      query: combinedQuery,
    },
    as: format({
      pathname: asPathName,
      query: Object.keys(combinedQuery)
        .filter(key => rewriteCombinedKeys[key] !== true)
        .reduce(
          (r, key) => ({
            ...r,
            [key]: combinedQuery[key],
          }),
          {}
        ),
    }),
  };
};

/*
const pageHref = toPageHref(rewrites, '/fn_x/hello?id=1');

const xx = toAsUrl(
  rewrites,
  peekKeysFromCurrentRoute,
  { pathname: '/hello', query: { id: 1, ff: 1 } },
  {
    pathname: '',
    query: { fn: 'x' },
  }
);

console.log('pageHref', pageHref);
console.log('xx', xx);
*/
