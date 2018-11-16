/* @flow */

import { GraphQLObjectType, GraphQLFloat } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './node';

export const PropertyType = new GraphQLObjectType({
  name: 'Property',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),

    livingSurface: {
      type: GraphQLFloat,
      resolve: parent => parent.living_surface,
    },

    createdAt: {
      type: GraphQLDateTime,
      resolve: parent => parent.created_at,
    },

    updatedAt: {
      type: GraphQLDateTime,
      resolve: parent => parent.updated_at,
    },
  }),
});
