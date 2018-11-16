/* @flow */

import { isEqual } from '../../utils/isEqual';

const variablesCache_: {
  [string]: { variables: {}, cachedVariables: {} },
} = {};

export const isInCache = (operationName: string, variables: {}) => {
  if (typeof window === 'undefined') return false;

  if (!(operationName in variablesCache_)) {
    return false;
  }

  const cached = variablesCache_[operationName];

  if (!isEqual(cached.variables, variables)) {
    return false;
  }

  return true;
};

export const setInCache = (operationName: string, variables: {}) => {
  if (typeof window === 'undefined') return;

  variablesCache_[operationName] = {
    variables,
    cachedVariables: variables,
  };
};

/*
export const updateVariablesCached = (operationName: string, variables: {}) => {
  // we use this on refetch, as there is no other way to check
  if (typeof window === 'undefined') return;

  if (operationName in variablesCache_) {
    variablesCache_[operationName] = {
      ...variablesCache_[operationName],
      variables,
    };
  }
};
*/
