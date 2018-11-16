/* @flow */
/* eslint-disable global-require */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

import { assignType, getType } from './utils';
import { type Context } from '../Context';
import { PropertyType } from './PropertyType';

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId, context: Context) => {
    const { type, id } = fromGlobalId(globalId);
    switch (type) {
      case 'Property':
        return context.properties.load(id).then(assignType('Property'));

      default:
        throw new Error(`Type ${type} is not implemented in node interface`);
    }
  },

  obj => {
    switch (getType(obj)) {
      case 'Property':
        return PropertyType;
      default:
        return null;
    }
  },
);
