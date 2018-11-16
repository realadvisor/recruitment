/* @flow */
import * as React from 'react';
import { graphql } from 'react-relay';
import { nextQuery } from '../controls/relay';
import { Property } from '../shared/Property';

import type { propertyQuery } from './__generated__/propertyQuery.graphql';

const PropertyPage = props => <Property property={props.data?.property} />;

const NULL_PROPERTY_ID =
  'UHJvcGVydHk6MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAw';

const PropertyP = nextQuery<propertyQuery, { propertyId: string }>(ctx => ({
  query: graphql`
    query propertyQuery($propertyId: ID!) {
      property: node(id: $propertyId) {
        ...Property_property
      }
    }
  `,
  variables: {
    propertyId: ctx.query.propertyId || NULL_PROPERTY_ID,
  },
  cacheStrategy: 'cache-first',
}))(PropertyPage);

export default PropertyP;
