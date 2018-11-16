/* @flow */

import { GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { PropertyType } from '../PropertyType';
import { PropertyInputType } from '../PropertyInputType';
import upsertPropertyTransaction from './upsertProperty';
import validate from './validate';
import { fromGlobalId } from '../utils';
import { type Context } from '../../Context';

export const upsertProperty = mutationWithClientMutationId({
  name: 'UpsertProperty',
  description: 'Upsert a property',
  inputFields: {
    property: { type: new GraphQLNonNull(PropertyInputType) },
  },
  outputFields: {
    property: { type: PropertyType },
  },
  async mutateAndGetPayload(input, ctx: Context) {
    const property = await validate(input.property, ctx);

    // upsert Property
    const upsertedProperty = await upsertPropertyTransaction(
      property,
      null,
      ctx,
    );

    return ctx.properties
      .load(upsertedProperty.id)
      .then(x => ({ property: x }));
  },
});

export const deleteProperty = mutationWithClientMutationId({
  name: 'DeleteProperty',
  inputFields: {
    propertyId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedPropertyId: { type: GraphQLID },
  },
  async mutateAndGetPayload(input, ctx: Context) {
    const propertyId = fromGlobalId(input.propertyId, 'Property');
    const [deletedPropertyId] = await ctx.db
      .table('properties')
      .where({ id: propertyId })
      .delete()
      .returning('id');
    return {
      deletedPropertyId:
        deletedPropertyId == null
          ? null
          : toGlobalId('Property', deletedPropertyId),
    };
  },
});
