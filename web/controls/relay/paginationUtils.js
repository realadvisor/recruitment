/* eslint-disable guard-for-in */
/* @flow */

import invariant from 'tiny-invariant';
import { getFragment } from 'relay-runtime';

type ConnectionMetadata = {
  path: ?Array<string>,
  direction: ?('forward' | 'backward' | 'bidirectional'),
  cursor: ?string,
  count: ?string,
};

function findConnectionMetadata(fragments) {
  let foundConnectionMetadata = null;
  let isRelayModern = false;
  for (const fragmentName in fragments) {
    const fragment = fragments[fragmentName];
    const connectionMetadata: ?Array<ConnectionMetadata> = (fragment.metadata &&
      fragment.metadata.connection: any);
    // HACK: metadata is always set to `undefined` in classic. In modern, even
    // if empty, it is set to null (never undefined). We use that knowlege to
    // check if we're dealing with classic or modern
    if (fragment.metadata !== undefined) {
      isRelayModern = true;
    }
    if (connectionMetadata) {
      invariant(
        connectionMetadata.length === 1,
        'ReactRelayPaginationContainer: Only a single @connection is ' +
          'supported, `%s` has %s.',
        fragmentName,
        connectionMetadata.length
      );
      invariant(
        !foundConnectionMetadata,
        'ReactRelayPaginationContainer: Only a single fragment with ' +
          '@connection is supported.'
      );
      foundConnectionMetadata = {
        ...connectionMetadata[0],
        fragmentName,
      };
    }
  }
  invariant(
    !isRelayModern || foundConnectionMetadata !== null,
    'ReactRelayPaginationContainer: A @connection directive must be present.'
  );
  return foundConnectionMetadata || ({}: any);
}

export function createGetConnectionFromProps(fragment: {}): any => ?{
  +edges: ?$ReadOnlyArray<?{ +node: mixed }>,
} {
  const fragments = Object.entries(fragment).reduce(
    (r, [k, v]) => ({ ...r, [k]: getFragment(v) }),
    {}
  );

  const metadata = findConnectionMetadata(fragments);
  // console.log(getFragment(fragments.root));

  const path = metadata.path;
  invariant(
    path,
    'ReactRelayPaginationContainer: Unable to synthesize a ' +
      'getConnectionFromProps function.'
  );
  return (props: {}) => {
    let data = props[metadata.fragmentName];
    for (let i = 0; i < path.length; i++) {
      if (!data || typeof data !== 'object') {
        return null;
      }
      data = data[path[i]];
    }
    return data;
  };
}
