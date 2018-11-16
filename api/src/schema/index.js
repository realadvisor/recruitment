/* @flow */
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from './node';
import { properties } from './property/queries';

import { upsertProperty, deleteProperty } from './property/mutations';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      node: nodeField,
      nodes: nodesField,
      properties,
    }),
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      upsertProperty,
      deleteProperty,
    }),
  }),
});
