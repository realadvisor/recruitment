/* @flow */

const replacer = (key, value) =>
  typeof value === 'object' && value != null && !Array.isArray(value)
    ? Object.keys(value)
        .sort()
        .reduce((sorted, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {})
    : value;

export const isEqual = (a: any, b: any) =>
  JSON.stringify(a, replacer) === JSON.stringify(b, replacer);
