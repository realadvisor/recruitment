/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {},
  migrations: {
    tableName: 'migrations',
  },
  debug: process.env.PGDEBUG === 'true',
});

export default db;

export const listingsDb = knex({
  client: 'pg',
  connection: {
    host: process.env.PG_LISTINGS_HOST,
    user: process.env.PG_LISTINGS_USER,
    password: process.env.PG_LISTINGS_PASSWORD,
    database: process.env.PG_LISTINGS_DATABASE,
  },
  debug: process.env.PGDEBUG === 'true',
});
