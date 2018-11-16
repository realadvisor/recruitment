// @flow

import * as React from 'react';
import { QueryRenderer } from 'react-relay';
import { EnvironmentConsumer } from './environment.js';

export type QueryType<T> = React.ComponentType<{|
  variables: $ElementType<T, 'variables'>,
  loading?: React.Node,
  children: ({
    data: $ElementType<T, 'response'>,
    retry: () => void,
  }) => React.Node,
|}>;

export const createQuery = <
  Query: {|
    variables: Object,
    response: $ReadOnly<Object>,
  |}
>(
  query: any
): QueryType<Query> => {
  const QueryComponent = props => (
    <EnvironmentConsumer>
      {environment => (
        <QueryRenderer
          environment={environment}
          query={query}
          variables={props.variables}
          render={({ props: data, retry }) =>
            data
              ? props.children({ data, retry })
              : props.loading != null
                ? props.loading
                : null
          }
        />
      )}
    </EnvironmentConsumer>
  );
  return QueryComponent;
};
