// @flow

import * as React from 'react';
import { createRefetchContainer } from 'react-relay';
import type { FragmentRefs } from './fragment.js';

export type RefetchFragmentType<T> = React.ComponentType<{|
  ...$Exact<FragmentRefs<T>>,
  children: ({
    ...$Exact<T>,
    refetch: () => void,
  }) => React.Node,
|}>;

export const createRefetchFragment = <T>(
  fragment: {},
  query: {}
): RefetchFragmentType<T> => {
  class Refetch extends React.Component<any> {
    render() {
      const { relay, children, ...data } = this.props;
      return children({
        ...data,
        refetch: relay.refetch,
      });
    }
  }

  return createRefetchContainer(Refetch, fragment, query);
};
