/* @flow */

import nextGetConfig from 'next/config';

export const getConfig = () => {
  // exports in nextjs are organized in manner exports = require('./dist/blabla')
  // in such case esm does not recognize that it could be possible es module
  // so we check on `default` export existance in runtime
  const cfg =
    'default' in nextGetConfig ? nextGetConfig.default() : nextGetConfig();
  return cfg;
};
