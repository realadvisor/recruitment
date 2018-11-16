/* @flow */
import { type Context } from '../../Context';

async function upsertTransaction(payload: any, trx: any) {
  const { id, ...property } = payload;

  if (id == null) {
    const data = await trx.table('properties').insert(property, ['*']);
    return data;
  } else if (Object.keys(payload).length !== 0) {
    const data = await trx
      .table('properties')
      .where({ id })
      .update(payload, ['*']);
    return data;
  }

  return [];
}

export default async function upsertProperty(
  data: any,
  trx: any,
  ctx: Context,
) {
  const { db } = ctx;
  let upsertedProperty;

  if (trx) {
    [upsertedProperty] = await upsertTransaction(data, trx);
  } else {
    [upsertedProperty] = await db.transaction(async t =>
      upsertTransaction(data, t),
    );
  }

  return upsertedProperty;
}
