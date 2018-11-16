# NEXT

To start

```bash
yarn
yarn dev
# open in browser
# http://localhost:3000/?host=lynx-immobilier.ch
```

## Folder Structure

- `controls` Data independent controls, must not have any relay dependencies. If control starts with small case this means that it's namespace for pack of controls.
- `shared` Shared data fragments etc.
- `pages` Base routing pathes.
- `svgs` Icons
- `theme` Base theme
- `tools` build tools
- `utils` shared utils

## Local routing

Always use internal `controls/Link` for routing, it supports Buttons, Links, etc.
Use any route as in naked nextjs `{pathname: '/NAME', query: {[string]: string}}`

We can add beautiful route rewrites later just in config.

See `next.config.js` `rewrites` section

```bash
    rewrites: [
      {
        path: '/products/:productId',
        page: 'product',
      },
    ],
```

this mean that for product page we provide a beautifull route `/products/:productId`

`peekKeysFromCurrentRoute` from config is used to preserve query keys across all links.

## Relay

```bach
yarn relay --watch
```

Pages queries have additional argument:

`cacheStrategy` can be 'none', `cache-first`, 'cache-only', 'cache-list'.

- `none` fetch then change route
- `cache-first` if data exists change route then fetch, if not exists fetch then change route
- `cache-only` if data exists change route, if not fetch then change route
- `cache-list` special case for lists - system trying to not refetch lists on back button - that allows to use loadMore and preserves list position.
