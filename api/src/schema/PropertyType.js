/* @flow */

import { GraphQLObjectType, GraphQLFloat, GraphQLInt } from 'graphql';
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

    landSurface: {
      type: GraphQLFloat,
      resolve: parent => parent.land_surface,
    },

    numberOfRooms: {
      type: GraphQLFloat,
      resolve: parent => parent.number_of_rooms,
    },

    numberOfParkings: {
      type: GraphQLInt,
      resolve: parent => parent.number_of_parkings,
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
