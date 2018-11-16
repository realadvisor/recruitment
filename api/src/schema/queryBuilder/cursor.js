/* @flow */

import { base64, unbase64 } from 'graphql-relay/lib/utils/base64';

export const parseCursor = (
  cursor: ?string,
): { offset: number, totalCount?: number } => {
  if (cursor == null) {
    return {
      offset: -1,
    };
  }

  return JSON.parse(unbase64(cursor));
};

export const cursorToOffset = (cursor: string) => parseCursor(cursor).offset;

const offsetToCursor = (offset: number, totalCount: number) => {
  const cursor = { offset, totalCount };
  const cursorStr = JSON.stringify(cursor);
  return base64(cursorStr);
};

export const connectionFromArray = (
  arr: Array<{ total_count?: number }>,
  args: { first: number, after?: ?string },
) => {
  if (arr.length > args.first) {
    throw new Error('Data array must be less or equal to first property');
  }

  const { offset, totalCount } = parseCursor(args.after);

  const currTotalCount =
    (totalCount != null
      ? totalCount
      : arr.length && parseInt(arr[0].total_count, 10)) || 0;

  const startOffset = offset + 1;

  const edges: Array<{ cursor: string, node: mixed }> = arr.map(
    (node: mixed, index: number) => ({
      cursor: offsetToCursor(startOffset + index, currTotalCount),
      node,
    }),
  );

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: offset > -1,
      hasNextPage: startOffset + arr.length < currTotalCount - 1,
    },
    totalCount: currTotalCount,
  };
};
