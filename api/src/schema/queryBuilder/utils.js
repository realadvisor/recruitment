// @flow

export const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]{1}/g, a => `_${a.toLowerCase()}`);
