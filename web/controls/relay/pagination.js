// @flow

import * as React from 'react';
import { createPaginationContainer } from 'react-relay';
import {
  requestAnimationTimeout,
  cancelAnimationTimeout,
} from '../../utils/requestAnimationTimeout';
import { createGetConnectionFromProps } from './paginationUtils';
import type { FragmentRefs } from './fragment.js';

type PaginationConfig<T, V> = {
  // Possibly will be extended with other methods when needed
  // so getConnectionFromProps is optional
  getConnectionFromProps?: T => ?{ +edges: ?$ReadOnlyArray<?{ +node: mixed }> },
  getVariables: T => $Shape<V>,
};

type ObserverOrCallback = (error: ?Error) => mixed;

export type PaginationType<T, V: {} = {}> = React.ComponentType<{|
  ...$Exact<FragmentRefs<T>>,
  children: ({
    ...$Exact<T>,
    loadUntil: (
      stopIndex: number,
      batchSize?: number,
      loadBeforeEndSize?: number
    ) => void,
    refetch: (
      totalCount: number,
      observerOrCallback: ?ObserverOrCallback,
      refetchVariables: ?V
    ) => void,
    hasMore: () => boolean,
  }) => React.Node,
|}>;

export const createForwardPagination = <T, V>(
  fragment: {},
  query: {},
  config?: PaginationConfig<T, V>
): PaginationType<T, V> => {
  const getConnectionFromProps =
    config && config.getConnectionFromProps
      ? config.getConnectionFromProps
      : (createGetConnectionFromProps(fragment): T => ?{
          +edges: ?$ReadOnlyArray<?{ +node: mixed }>,
        });

  let refetchVariables_: {};

  class Pagination extends React.Component<any> {
    timeoutId = null;
    loading = false;
    operationName_: string;

    _loadUntil = (size: number, batchSize = 20, loadBeforeEndSize = 10) => {
      const { relay, children, ...data } = this.props;
      const connection = getConnectionFromProps(data);

      const count =
        connection && connection.edges ? connection.edges.length : 0;
      const pageSize = Math.max(size - (count - 1), 1);

      if (this.timeoutId) {
        cancelAnimationTimeout(this.timeoutId);
      }

      if (this.loading || relay.isLoading()) {
        this.timeoutId = requestAnimationTimeout(
          () => this._loadUntil(size),
          100
        );
      } else if (count < size + loadBeforeEndSize && relay.hasMore()) {
        this.loading = true;

        relay.loadMore(pageSize + batchSize, () => {
          this.loading = false;
        });
      }
    };

    _refetch = (totalCount, observerOrCallback, refetchVariables) => {
      // console.log('operationName_', this.operationName_, refetchVariables);
      // updateVariablesCached(this.operationName_, refetchVariables);
      refetchVariables_ = refetchVariables;
      this.props.relay.refetchConnection(
        totalCount,
        observerOrCallback,
        refetchVariables
      );
    };

    render() {
      const { relay, children, ...data } = this.props;

      return children({
        ...data,
        loadUntil: this._loadUntil,
        refetch: this._refetch,
        hasMore: relay.hasMore,
      });
    }
  }

  return createPaginationContainer(Pagination, fragment, {
    direction: 'forward',
    getVariables: (props, paginationInfo, fragmentVariables) => ({
      ...fragmentVariables,
      ...refetchVariables_,
      ...paginationInfo,
      ...(config && config.getVariables ? config.getVariables(props) : {}),
    }),
    getConnectionFromProps:
      config && config.getConnectionFromProps
        ? config.getConnectionFromProps
        : undefined,
    query,
  });
};
