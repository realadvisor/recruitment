// @flow
import * as React from 'react';
import type { UserData } from '../../server/UserData';

// const OperationCtx = React.createContext('');
// export const OperationConsumer = OperationCtx.Consumer;

export type NextQueryProps<T, Q> = {|
  data: $Exact<{ ...$ElementType<T, 'response'> }>,
  variables: $Exact<{ ...$ElementType<T, 'variables'> }>,
  operationName: string,
  userData: $Exact<{ ...UserData }>,
  router: {|
    pathname: string,
    query: Q,
  |},
|};

export type CacheStrategy =
  | 'none'
  | 'cache-first'
  | 'cache-only'
  | 'cache-list';

export function nextQuery<
  T: { variables: Object, response: $ReadOnly<Object> },
  Q: { [string]: string }
>(
  init: (
    ctx: {
      pathname: string,
      query: Q,
    },
    userData: {| ...UserData |}
  ) => {
    query: any,
    variables: $ElementType<T, 'variables'>,
    cacheStrategy?: CacheStrategy,
  }
): (
  // exact and spread forces hovers to work
  React.ComponentType<$Exact<{ ...NextQueryProps<T, Q> }>>
) => React.ComponentType<$Exact<NextQueryProps<T, Q>>> {
  const fn = Base => {
    const comp = props => {
      return <Base {...props} />;
    };
    comp.getRelay = init;
    return comp;
  };

  return fn;
}
