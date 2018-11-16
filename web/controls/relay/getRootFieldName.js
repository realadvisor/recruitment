/* @flow */

import { getRequest } from 'relay-runtime';

export default (environment: any, mutation: any) => {
  const operation = getRequest(mutation);
  const kind = operation?.fragment?.selections?.[0]?.kind;
  if (kind === 'LinkedField') {
    return operation?.fragment?.selections?.[0]?.name;
  }
  return undefined;
};
