/* @flow */
import { parse } from '../url';

test('test that parse returns non null for pathname and query', () => {
  expect(parse('')).toEqual({ pathname: '/', query: {} });
  expect(parse('/')).toEqual({ pathname: '/', query: {} });
  expect(parse('/')).toEqual({ pathname: '/', query: {} });
  expect(parse('/hi?all')).toEqual({ pathname: '/hi', query: { all: '' } });
});
