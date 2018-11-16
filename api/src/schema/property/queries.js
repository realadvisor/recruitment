// @flow

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';
import { forwardConnectionArgs, connectionDefinitions } from 'graphql-relay';
import { resolveList } from './resolveList';
import { PropertyType } from '../PropertyType';

const { connectionType } = connectionDefinitions({
  name: 'PropertyConnection',
  nodeType: new GraphQLNonNull(PropertyType),
  connectionFields: {
    totalCount: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const properties = {
  type: connectionType,
  args: {
    ...forwardConnectionArgs,
    sortBy: { type: GraphQLString },
    sortDirection: { type: GraphQLString },
    filters: {
      type: new GraphQLInputObjectType({
        name: 'PropertyFilters',
        fields: {
          livingSurface_lte: { type: GraphQLInt },
          livingSurface_gte: { type: GraphQLInt },
        },
      }),
    },
  },
  resolve: resolveList,
};
