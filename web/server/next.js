/* @flow */

import { createServer } from 'http';
import { parse } from 'url';
import { join } from 'path';
// import compression from 'compression';
import next from 'next';
import { getConfig } from '../utils/getConfig';
import { toPageHref } from '../utils/rewrites';

const port = process.env.PORT != null ? process.env.PORT : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const isRootStatic = (url: string) => url.startsWith('/favicon.ico');

const isSystemUrl = (url: string) =>
  url.startsWith('/static') || url.startsWith('/_next/') || isRootStatic(url);

const processData = (req: http$IncomingMessage, res: http$ServerResponse) => {
  const {
    publicRuntimeConfig: { rewrites },
  } = getConfig();

  if (req.url.includes('/printenv')) {
    res.end(JSON.stringify(req.headers, null, ' '));
    return;
  }

  const parsed: {
    pathname: string | void,
    query: { [string]: string } | void,
  } = parse(req.url, true);
  const { pathname = '/' } = parsed;

  if (isRootStatic(req.url)) {
    // pathname
    const staticPath = join(__dirname, 'static', pathname);
    app.serveStatic(req, res, staticPath);
    return;
  }

  const handle = app.getRequestHandler();

  if (!isSystemUrl(req.url)) {
    const match = toPageHref(rewrites, req.url);
    if (match) {
      handle(req, res, match);
      return;
    }
  }

  handle(req, res);
};

app.prepare().then(() => {
  createServer(processData).listen(port, err => {
    if (err) throw err;
    // eslint-disable-next-line
    console.log(`> Ready on http://localhost:${port}`);
  });
});
