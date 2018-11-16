// @flow

import assert from 'assert';
import { type Context } from '../../Context.js';
import { whereClauseBuilder } from './whereClauseBuilder.js';

type Params = {|
  ctx: Context,
  input: Object,
  table: string,
|};

export const deleteMutationBuilder = (params: Params) => {
  const { ctx, input, table } = params;
  const { db } = ctx;
  const query = db.table(table).delete();

  assert(
    typeof input.where === 'object' && input.where != null,
    'input.where in delete mutation should be an object',
  );

  Object.keys(input.where).forEach(whereKey => {
    whereClauseBuilder({
      ctx,
      query,
      table,
      key: whereKey,
      value: input.where[whereKey],
    });
  });

  return { query };
};
