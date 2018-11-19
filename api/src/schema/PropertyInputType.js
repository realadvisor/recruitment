import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';

export const fields = {
  id: { type: GraphQLID },
  numberOfRooms: { type: GraphQLFloat },
  livingSurface: { type: GraphQLFloat },
  landSurface: { type: GraphQLFloat },
  numberOfParkings: { type: GraphQLInt },
};

export const PropertyInputType = new GraphQLInputObjectType({
  name: 'PropertyInput',
  fields,
});
