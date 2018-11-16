/* @flow */

import { toPageHref, toAsUrl } from '../rewrites';

const peekKeysFromCurrentRoute = ['lng', 'fn', 'version', 'editor', 'host'];

// const pages = [''];

const rewrites = [
  {
    path: '/products/:productId',
    page: 'product',
  },
  // custom pages rewrite rule example
  {
    path: '/:customPageId?',
    exclude: {
      // do transform for pages except
      // here should be glob('pages/*.js')
      customPageId: ['lalala', 'fn_*'],
    },
    page: 'custom',
  },
  // global rewrite rule
  {
    path: '/fn_:fn',
    page: '',
  },
];

/*
test('custom page rewrite rule', () => {
  expect(toPageHref(rewrites, '/hello')).toEqual({});
});
*/
test('toAsUrl custom simple', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/custom',
        query: {
          customPageId: 'hello',
        },
      },
      { pathname: '/', query: {} }
    )
  ).toEqual({
    as: '/hello',
    href: {
      pathname: '/custom',
      query: {
        customPageId: 'hello',
      },
    },
  });
});

test('toAsUrl custom with global rule', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/custom',
        query: {
          customPageId: 'hello',
        },
      },
      {
        pathname: '/',
        query: {
          fn: 'callME',
        },
      }
    )
  ).toEqual({
    as: '/fn_callME/hello',
    href: {
      pathname: '/custom',
      query: {
        customPageId: 'hello',
        fn: 'callME',
      },
    },
  });
});

test('toAsUrl custom with global rule and subpath', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/custom/tee',
        query: {
          customPageId: 'hello',
        },
      },
      {
        pathname: '/',
        query: {
          fn: 'callME',
        },
      }
    )
  ).toEqual({
    as: '/fn_callME/hello/tee',
    href: {
      pathname: '/custom/tee',
      query: {
        customPageId: 'hello',
        fn: 'callME',
      },
    },
  });
});

test('toAsUrl global rule found', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/product',
        query: {
          productId: 'hey',
        },
      },
      { pathname: '/', query: { fn: 'hellofn' } }
    )
  ).toEqual({
    as: '/fn_hellofn/products/hey',
    href: {
      pathname: '/product',
      query: {
        fn: 'hellofn',
        productId: 'hey',
      },
    },
  });
});

test('toAsUrl only global rule found', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/about',
        query: {},
      },
      { pathname: '/', query: { fn: 'hellofn' } }
    )
  ).toEqual({
    as: '/fn_hellofn/about',
    href: {
      pathname: '/about',
      query: {
        fn: 'hellofn',
      },
    },
  });
});

test('toAsUrl rule found', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/product',
        query: {
          productId: 'hey',
        },
      },
      { pathname: '/' }
    )
  ).toEqual({
    as: '/products/hey',
    href: {
      pathname: '/product',
      query: {
        productId: 'hey',
      },
    },
  });
});

test('toAsUrl rule found and additional vars exists', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/product',
        query: {
          productId: 'hey',
          someNonRuleVar: 'hi',
        },
      },
      { pathname: '/' }
    )
  ).toEqual({
    as: '/products/hey?someNonRuleVar=hi',
    href: {
      pathname: '/product',
      query: {
        productId: 'hey',
        someNonRuleVar: 'hi',
      },
    },
  });
});

test('toAsUrl rule not found', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/hello',
        query: {
          productId: 'hey',
        },
      },
      { pathname: '/' }
    )
  ).toEqual({
    as: '/hello?productId=hey',
    href: {
      pathname: '/hello',
      query: {
        productId: 'hey',
      },
    },
  });
});

test('toAsUrl preserves peekKeysFromCurrentRoute keys from current route', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/hello',
        query: {
          productId: 'hey',
        },
      },
      { pathname: '/', query: { lng: 'fr', not_in_preserved: 'hi' } }
    )
  ).toEqual({
    as: '/hello?lng=fr&productId=hey',
    href: {
      pathname: '/hello',
      query: {
        lng: 'fr',
        productId: 'hey',
      },
    },
  });
});

test('toAsUrl overrides preserved keys', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/hello',
        query: {
          lng: 'en',
          productId: 'hey',
        },
      },
      { pathname: '/', query: { lng: 'fr', not_in_preserved: 'hi' } }
    )
  ).toEqual({
    as: '/hello?lng=en&productId=hey',
    href: {
      pathname: '/hello',
      query: {
        lng: 'en',
        productId: 'hey',
      },
    },
  });
});

test('toAsUrl allows remove preseved key', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/hello',
        query: {
          productId: 'hey',
          lng: null, // <-- remove
        },
      },
      { pathname: '/', query: { lng: 'fr', not_in_preserved: 'hi' } }
    )
  ).toEqual({
    as: '/hello?productId=hey',
    href: {
      pathname: '/hello',
      query: {
        productId: 'hey',
      },
    },
  });
});

test('toPageHref custom not excluded', () => {
  expect(toPageHref(rewrites, '/some-not-excluded')).toEqual({
    pathname: '/custom',
    query: {
      customPageId: 'some-not-excluded',
    },
  });
});

test('toPageHref custom not excluded with subpath', () => {
  expect(toPageHref(rewrites, '/some-not-excluded/tee')).toEqual({
    pathname: '/custom/tee',
    query: {
      customPageId: 'some-not-excluded',
    },
  });
});

test('toPageHref custom not excluded with subpath and fn_', () => {
  expect(toPageHref(rewrites, '/fn_func/some-not-excluded/tee')).toEqual({
    pathname: '/custom/tee',
    query: {
      customPageId: 'some-not-excluded',
      fn: 'func',
    },
  });
});

test('toPageHref unknown', () => {
  expect(toPageHref(rewrites, '/fn_hello/lalala')).toEqual({
    pathname: '/lalala',
    query: {
      fn: 'hello',
    },
  });

  expect(toPageHref(rewrites, '/fn_hello/lalala/la')).toEqual({
    pathname: '/lalala/la',
    query: {
      fn: 'hello',
    },
  });

  // we don't need a special processing for such paths
  expect(toPageHref(rewrites, '/lalala')).toEqual(null);
});

test('toPageHref base', () => {
  expect(toPageHref(rewrites, '/fn_hello/products/hey')).toEqual({
    pathname: '/product',
    query: {
      fn: 'hello',
      productId: 'hey',
    },
  });

  expect(toPageHref(rewrites, '/products/hey')).toEqual({
    pathname: '/product',
    query: {
      productId: 'hey',
    },
  });
});

test('toPageHref root', () => {
  expect(toPageHref(rewrites, '/')).toEqual({
    pathname: '/custom',
    query: {
      customPageId: '',
    },
  });

  expect(toPageHref(rewrites, '/fn_hello')).toEqual({
    pathname: '/custom',
    query: {
      customPageId: '',
      fn: 'hello',
    },
  });

  expect(toPageHref(rewrites, '/fn_hello/')).toEqual({
    pathname: '/custom',
    query: {
      customPageId: '',
      fn: 'hello',
    },
  });
});

test('toAsUrl root', () => {
  expect(
    toAsUrl(
      rewrites,
      peekKeysFromCurrentRoute,
      {
        pathname: '/custom',
        query: {
          customPageId: '',
          lng: 'en',
        },
      },
      {
        pathname: '/custom',
        query: {
          customPageId: '',
          lng: 'fr',
        },
      }
    )
  ).toEqual({
    as: '/?lng=en',
    href: {
      pathname: '/custom',
      query: {
        lng: 'en',
        customPageId: '',
      },
    },
  });
});
