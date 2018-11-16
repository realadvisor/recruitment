// @flow

import pluralize from 'pluralize';
import { toSnakeCase } from './utils.js';
import { tableAliases, columnAliases } from './aliases.js';

const { singular } = pluralize;

type Props = {|
  query: any,
  table: string,
  sortBy: string,
  sortDirection: string,
|};

/*
 * Sort values examples
 * values are splitted with pipe operator
 *
 * createdBy_firstName|createdBy_lastName
 * broker_firstName|broker_lastName
 * property_propertyType_name
 * stage_order_nr|stage_pipeline_id
 * property_numberOfRooms|property_numberOfBathrooms
 * property_livingSurface|property_landSurface
 */

const sortByBuilder = params => {
  const keys = params.sortBy.split('_');
  const tables = [
    params.table,
    ...keys.slice(0, -1).map(t => pluralize(toSnakeCase(t))),
  ];
  const field = toSnakeCase(keys[keys.length - 1]);

  let lastAlias = tables[0];

  tables.forEach((currTable, index) => {
    if (index !== 0) {
      const pluralCurrTable = tableAliases[currTable] || currTable;
      const prevTableColumn =
        columnAliases[singular(currTable)] || `${singular(currTable)}_id`;
      const currTableAlias = `__sorting_${params.pipedIndex}_${index}__`;
      params.query.joinRaw(
        `LEFT JOIN ${pluralCurrTable} AS ${currTableAlias}` +
          ` ON ${lastAlias}.${prevTableColumn}=${currTableAlias}.id`,
      );
      lastAlias = currTableAlias;
    }
  });

  params.query.orderByRaw(`${lastAlias}.${field} ${params.sortDirection}`);
};

export const sortingBuilder = (params: Props) =>
  params.sortBy.split('|').forEach((item, index) =>
    sortByBuilder({
      query: params.query,
      pipedIndex: index,
      table: params.table,
      sortBy: item,
      sortDirection: params.sortDirection,
    }),
  );
