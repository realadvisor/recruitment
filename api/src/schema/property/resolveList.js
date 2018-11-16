// @flow

import { type Context } from '../../Context.js';
import {
  queryBuilder,
  connectionFromArray,
  cursorToOffset,
} from '../queryBuilder';

export const resolveList = async function resolve(
  root: any,
  args: any,
  ctx: Context,
) {
  const { query } = queryBuilder({
    ctx,
    args,
    table: 'properties',
    cursorToOffset,
    defaultSortBy: ({ query: dbQuery }) => {
      dbQuery.orderBy('properties.created_at', 'desc');
    },
  });

  return connectionFromArray(await query, args);
};
