// @flow
/* eslint-disable no-nested-ternary */
import { cursorToOffset as relayCursorToOffset } from 'graphql-relay';
import { whereClauseBuilder } from './whereClauseBuilder.js';
import { sortingBuilder } from './sortingBuilder.js';

type Params = {|
  ctx: { db: any },
  args: Object,
  table: string,
  prepareTotalCount?: boolean,
  prepareCountOnly?: boolean,
  prepareLimit?: boolean,
  cursorToOffset?: any,
  query?: any,
  sortBy?: Object,
  defaultSortBy?: Function,
  stableSortBy?: Function,
  filters?: Object,
|};

export default function queryBuilder(params: Params) {
  const {
    ctx,
    args,
    table,
    prepareTotalCount = true,
    prepareCountOnly = false,
    prepareLimit = true,
    cursorToOffset = relayCursorToOffset,
    defaultSortBy,
    stableSortBy,
  } = params;
  const { db } = params.ctx;

  // TODO: move limit offset logic out of queryBuilder
  const limit = typeof args.first === 'undefined' ? '10' : args.first;
  const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

  const query =
    params.query ||
    db
      .select(
        prepareCountOnly
          ? db.raw('count(*)::int as total_count')
          : prepareTotalCount
            ? [`${table}.*`, db.raw('count(*) OVER() AS total_count')]
            : [`${table}.*`],
      )
      .from(table);

  // Filters
  if (args.filters) {
    const customFiltersKeys = params.filters ? Object.keys(params.filters) : [];

    Object.keys(args.filters)
      .filter(filter => !customFiltersKeys.includes(filter))
      .forEach(filter => {
        whereClauseBuilder({
          ctx,
          query,
          table,
          key: filter,
          value: args.filters[filter],
        });
      });

    // Custom filters
    if (params.filters) {
      const customFilters = params.filters;
      Object.keys(args.filters)
        .filter(filter => customFiltersKeys.includes(filter))
        .forEach(filter => {
          customFilters[filter]({
            value: args.filters[filter],
            query,
            db,
          });
        });
    }
  }

  if (prepareCountOnly) {
    query.first();
    return { query, limit, offset };
  }

  // Sort and sort direction
  const sortDirection = args.sortDirection
    ? db.raw(`${args.sortDirection} NULLS LAST`)
    : db.raw('ASC NULLS LAST');

  if (args.sortBy) {
    const customSortBy = params.sortBy;
    // Custom sortBy logic
    if (customSortBy && customSortBy[args.sortBy]) {
      customSortBy[args.sortBy]({
        query,
        sortDirection,
        sortingBuilder,
      });
    } else {
      sortingBuilder({
        query,
        table,
        sortBy: args.sortBy,
        sortDirection: sortDirection.toString(),
      });
    }
  } else if (defaultSortBy) {
    defaultSortBy({ query });
  } else {
    query.orderBy(`${table}.created_at`, 'desc');
  }

  // stable sorting
  if (stableSortBy) {
    stableSortBy({ query });
  } else {
    query.orderBy(`${table}.id`, 'asc');
  }

  if (prepareLimit) {
    query.limit(limit).offset(offset);
  }

  return { query, limit, offset };
}
