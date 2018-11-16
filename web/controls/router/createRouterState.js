/* @flow */

import * as React from 'react';
import deepmerge from 'deepmerge';
// import { setDelay } from '../relay/delayNetwork';
import { WithRouter } from './WithRouter';

type $DeepShape<O: Object> = Object &
  $Shape<$ObjMap<O, (<V: Object>(V) => $DeepShape<V>) | (<V>(V) => V)>>;

const overwriteMerge = (destinationArray, sourceArray /* , options */) =>
  sourceArray;

const deepRemoveNulls = (query: Object) =>
  Object.keys(query).reduce(
    (r, k) =>
      query[k] == null
        ? r
        : {
            ...r,
            [k]:
              typeof query[k] === 'object' && !Array.isArray(query[k])
                ? deepRemoveNulls(query[k])
                : query[k],
          },
    {}
  );

export function parseRouterState<S>(
  query: { [string]: string },
  defaultState: S
): S {
  const routState = query.params ? JSON.parse(query.params) : {};
  const state: S = (deepmerge(defaultState, routState, {
    arrayMerge: overwriteMerge,
  }): any);

  return state;
}

export function createRouterState<S>(
  defaultState: S
): React.ComponentType<{|
  initial?: $Shape<S>,
  children: ({
    state: S,
    setState: (stateShape: $Shape<S>, reset?: boolean) => void,
  }) => React.Node,
|}> {
  return ({
    initial,
    children,
  }: {|
    initial?: $Shape<S>,
    children: ({
      state: S,
      setState: (stateShape: $Shape<S>, reset?: boolean) => void,
    }) => React.Node,
  |}) => (
    <WithRouter>
      {router => {
        let routState = router.query.params
          ? JSON.parse(router.query.params)
          : {};

        const def = deepmerge(defaultState, initial != null ? initial : {});

        const state: S = (deepmerge(def, routState, {
          arrayMerge: overwriteMerge,
        }): any);

        return children({
          state,
          setState: (partialState, reset = false) => {
            if (reset) {
              routState = {};
            }

            const newState = deepRemoveNulls(
              deepmerge(routState, partialState, { arrayMerge: overwriteMerge })
            );

            const query = {
              ...router.query,
              params: JSON.stringify(newState),
            };

            if (Object.keys(newState).length === 0) {
              delete query.params;
            }

            const href = {
              pathname: router.pathname,
              query,
            };

            router.replace(href, href, {
              shallow: false,
            });
          },
        });
      }}
    </WithRouter>
  );
}
