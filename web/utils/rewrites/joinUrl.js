// @flow

const re = /([^:])\/{2,}/gi;

export const joinURL = (...args: Array<string>) =>
  args
    .join('/')
    .replace(re, '$1/')
    .replace(/^\/{2,}/gi, '/')
    .replace(/\/+$/gi, '');
