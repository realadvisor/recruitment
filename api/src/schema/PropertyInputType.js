import { GraphQLID, GraphQLInputObjectType, GraphQLFloat } from 'graphql';

export const fields = {
  id: { type: GraphQLID },
  livingSurface: { type: GraphQLFloat },
};

export const PropertyInputType = new GraphQLInputObjectType({
  name: 'PropertyInput',
  fields,
});
