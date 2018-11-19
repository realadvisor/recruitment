/* @flow */
import * as React from 'react';
import { graphql } from 'react-relay';
import { nextQuery } from '../controls/relay';
import { Properties } from '../shared/Properties';

import type { propertiesQuery } from './__generated__/propertiesQuery.graphql';

const PropertiesPage = props => <Properties root={props.data} />;

const PropertiesP = nextQuery<propertiesQuery, { propertyId: string }>(() => ({
  query: graphql`
    query propertiesQuery {
      ...Properties_root
    }
  `,
  variables: {},
  cacheStrategy: 'cache-first',
}))(PropertiesPage);

export default PropertiesP;
