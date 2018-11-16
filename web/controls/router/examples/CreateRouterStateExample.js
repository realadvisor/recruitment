/* @flow */

import * as React from 'react';
import { createRouterState } from '../createRouterState';

type Filters = {|
  a?: number | null,
  b?: $ReadOnlyArray<number> | null,
|};

const RouterState = createRouterState(
  ({
    hello: 'world',
  }: {
    hello: string | null,
  })
);

const RouterState2 = createRouterState(
  ({
    filters: {
      a: 1,
      b: [1, 2],
    },
  }: { filters: Filters | null })
);

export const CreateRouterStateExample = () => (
  <div
    css={`
      padding: 16px;
    `}
  >
    <RouterState>
      {({ state, setState }) => (
        <div>
          <input
            value={state.hello}
            onChange={e => setState({ hello: e.target.value })}
          />
          <button onClick={() => setState({ hello: null })}>Clear</button>
        </div>
      )}
    </RouterState>

    <RouterState2>
      {({ state, setState }) => (
        <div>
          <input
            value={state.filters?.a}
            onChange={() => setState({ filters: { a: 1 } })}
          />
          <input
            value={state.filters?.b?.[0]}
            onChange={() => setState({ filters: { a: 2 } })}
          />
        </div>
      )}
    </RouterState2>
  </div>
);
