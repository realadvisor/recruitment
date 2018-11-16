/* @flow */
/* eslint-disable import/prefer-default-export */

import { fromGlobalId as parse } from 'graphql-relay';
import { GraphQLObjectType } from 'graphql';
import { type Context } from '../Context';

type ExpectedType = string | Array<string | GraphQLObjectType>;

export function assignType(type: string) {
  return (obj: any) => {
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    if (obj) obj.__type = type;
    return obj;
  };
}

export function getType(obj: any) {
  // eslint-disable-next-line no-underscore-dangle
  return obj ? obj.__type : undefined;
}

export function mapTo(
  keys: Array<string | number>,
  keyFn: any => string | number,
) {
  return (rows: Array<any>) => {
    const group = new Map(keys.map(key => [key, null]));
    rows.forEach(row => group.set(keyFn(row), row));
    /* $FlowFixMe */
    return Array.from(group.values());
  };
}

export function fromGlobalId(
  globalId: string,
  expectedType: ExpectedType,
): string {
  let types = Array.isArray(expectedType) ? expectedType : [expectedType];
  types = types.map(type => (typeof type === 'object' ? type.name : type));
  const { id, type } = parse(globalId);

  if (!types.includes(type)) {
    throw new Error(
      `Expected input ID of type '${types.join(', ')}' but got '${type}'.`,
    );
  }

  return id;
}

export function fromGlobalIds(
  globalIds: Array<string>,
  expectedType: ExpectedType,
): Array<string> {
  return globalIds.map(globalId => fromGlobalId(globalId, expectedType));
}

export type TransactionFn = (
  data: Object,
  trx: any,
  ctx: Context,
) => ?Promise<Object>;

export const wrapTransaction = (func: TransactionFn) => (
  data: Object,
  trx: any,
  ctx: Context,
) => {
  if (trx) {
    return func(data, trx, ctx);
  }

  return ctx.db.transaction(t => func(data, t, ctx));
};
