import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';

export const fields = {
  id: { type: GraphQLID },
  livingSurface: { type: GraphQLFloat },
  landSurface: { type: GraphQLFloat },
  numberOfRooms: { type: GraphQLFloat },
  numberOfParkings: { type: GraphQLInt },
};

export const PropertyInputType = new GraphQLInputObjectType({
  name: 'PropertyInput',
  fields,
});
