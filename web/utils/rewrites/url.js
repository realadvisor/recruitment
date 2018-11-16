/* @flow */
import { parse as parseUrl } from 'url';
export { format } from 'url';

export const parse = (
  urlStr: string
): { pathname: string, query: { [string]: string } } => {
  const { pathname, query } = parseUrl(urlStr || '/', true);
  if (query == null || pathname == null) {
    throw new Error('query is always an object');
  }
  return { pathname, query };
};
