/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import expressGraphQL from 'express-graphql';
import schema from './schema';
import { Context } from './Context';
import db from './db_';

const app = express();

app.set('trust proxy', 1);

app.use(
  cors((req, callback) => {
    callback(null, {
      origin: true,
      credentials: true,
      maxAge: 60 * 5,
    });
  }),
);

app.use(compression());

// Health check endpoint (see the load balancer settings)
app.get('/check', (req, res) => {
  res.type('text/plain').send('OK');
});

app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    context: new Context(req, db),
    graphiql: true, // process.env.GCP_PROJECT !== '<name>',
    pretty: false,
    formatError: err => {
      console.error(err.originalError || err); // eslint-disable-line no-console
      return {
        message: err.message,
        code: err.originalError && err.originalError.code,
        state: err.originalError && err.originalError.state,
        locations: err.locations,
        path: err.path,
      };
    },
  })),
);

app.use((err, req, res, next) => {
  console.error(err); // eslint-disable-line no-console

  if (res.headersSent) {
    next(err);
    return;
  }

  res.status(500).send((err && err.message) || 'API error.');
});

export default app;
