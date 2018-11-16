// @flow

import pluralize from 'pluralize';
import { fromGlobalId } from 'graphql-relay';
import { toSnakeCase } from './utils.js';
import { tableAliases, columnAliases } from './aliases.js';

type Params = {|
  ctx: { db: any },
  query: any,
  table: string,
  key: string,
  value: string,
|};

const EQ = 'eq';
const LIKE = 'like';
const ILIKE = 'ilike';
const IN = 'in';
const NIN = 'nin';
const GTE = 'gte';
const GT = 'gt';
const LTE = 'lte';
const LT = 'lt';

const MODIFIERS = [EQ, LIKE, ILIKE, IN, NIN, GTE, GT, LTE, LT];

const parseFilterKey = (table, filterKey, filterValue) => {
  const keys = filterKey.split('_');
  let modifier = null;
  let idx = keys.length - 1;
  let value = filterValue;

  if (MODIFIERS.includes(keys[idx])) {
    modifier = keys[idx];
    idx -= 1;
  }

  const field = `${toSnakeCase(keys[idx])}`;

  // Determine if field is ID field and convert from globalId to database ID
  if (/id$/.test(field) || columnAliases[field]) {
    if (value != null) {
      if (!Array.isArray(value)) {
        value = fromGlobalId(value).id;
      } else {
        value = value.map(v => fromGlobalId(v).id);
      }
    }
  }

  const tables = [table, ...keys.slice(0, idx)].map(t => toSnakeCase(t));

  return {
    tables,
    modifier,
    field,
    value,
  };
};

const addQueryModifier = (query, db, modifier, table, fieldArg, value) => {
  const field = `${table}.${fieldArg}`;

  if (modifier == null) {
    query.where(field, '=', value);
  }

  if (modifier === 'eq' && value != null) {
    query.where(field, '=', value);
  }

  if (modifier === 'like' && value != null) {
    query.where(field, 'LIKE', `%${value}%`);
  }

  if (modifier === 'ilike' && value != null) {
    query.where(
      field,
      'ILIKE',
      db.raw('f_unaccent(?)', `%${value.replace(/\s+/g, '%')}%`),
    );
  }

  if (modifier === 'in' && Array.isArray(value)) {
    if (value.includes(null) && value.length === 1) {
      query.whereNull(field, value);
    } else if (value.includes(null)) {
      query.where(subQ => {
        subQ.whereNull(field).orWhereIn(field, value.filter(v => v !== null));
      });
    } else {
      query.whereIn(field, value);
    }
  }

  if (modifier === 'nin' && Array.isArray(value)) {
    // query.whereNotIn(field, value);
    if (value.includes(null) && value.length === 1) {
      query.whereNotNull(field, value);
    } else if (value.includes(null)) {
      query.where(subQ => {
        subQ
          .whereNotNull(field)
          .whereNotIn(field, value.filter(v => v !== null));
      });
    } else {
      query.whereNotIn(field, value);
    }
  }

  if (modifier === 'gte') {
    query.where(field, '>=', value);
  }

  if (modifier === 'gt') {
    query.where(field, '>', value);
  }

  if (modifier === 'lte') {
    query.where(field, '<=', value);
  }

  if (modifier === 'lt') {
    query.where(field, '<', value);
  }
};

export const whereClauseBuilder = (params: Params) => {
  const { modifier, field, value, tables } = parseFilterKey(
    params.table,
    params.key,
    params.value,
  );

  const { ctx, query } = params;

  const SKIP_NULL_MODIFIERS = MODIFIERS;

  if (value !== null || !SKIP_NULL_MODIFIERS.includes(modifier)) {
    query.where(
      tables.reduceRight(
        (queryFn, currTbl, index, tbls) => {
          if (index > 0) {
            const prevTable = tbls[index - 1];
            const pluralCurrTbl =
              tableAliases[pluralize(currTbl)] || pluralize(currTbl);
            const pluralPrevTable =
              tableAliases[pluralize(prevTable)] || pluralize(prevTable);

            if (pluralize.isSingular(currTbl)) {
              return subQuery =>
                subQuery.whereExists(sQ =>
                  sQ
                    .table(pluralCurrTbl)
                    .where(queryFn)
                    .whereRaw(
                      `${pluralCurrTbl}.id = ${pluralPrevTable}.${columnAliases[
                        currTbl
                      ] || `${currTbl}_id`}`,
                    )
                    .select(),
                );
            }

            const crossTable =
              tableAliases[`${pluralPrevTable}_${pluralCurrTbl}`] ||
              `${pluralPrevTable}_${pluralCurrTbl}`;

            return subQuery =>
              subQuery.whereExists(sQ =>
                sQ
                  .table(pluralCurrTbl)
                  .where(queryFn)
                  .join(
                    `${crossTable}`,
                    `${crossTable}.${pluralize.singular(pluralCurrTbl)}_id`,
                    `${pluralCurrTbl}.id`,
                  )
                  .whereRaw(
                    `${pluralPrevTable}.id = ${crossTable}.${columnAliases[
                      pluralize.singular(pluralPrevTable)
                    ] || `${pluralize.singular(pluralPrevTable)}_id`}`,
                  )
                  .select(),
              );
          }

          return queryFn;
        },
        subQuery =>
          addQueryModifier(
            subQuery,
            ctx.db,
            modifier,
            pluralize(tables[tables.length - 1]),
            field,
            value,
          ),
      ),
    );
  }
};
