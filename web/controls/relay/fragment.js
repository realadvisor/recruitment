// @flow

import * as React from 'react';
import { createFragmentContainer } from 'react-relay';

export type $FragmentRef<T> = {
  +$fragmentRefs: $ElementType<T, '$refType'>,
};

type ExtractFragmentRef = (<T: { +[string]: mixed }>(T) => $FragmentRef<T>) &
  (<T>(T) => ?$FragmentRef<T>);

export type FragmentRefs<T> = $ObjMap<T, ExtractFragmentRef>;

export type FragmentType<T> = React.ComponentType<{|
  ...$Exact<FragmentRefs<T>>,
  children: (
    // to show as expanded
    $ObjMap<T, (<T: Object>(T) => $Exact<{ ...T }>) & (<T>(T) => ?T)>
  ) => React.Node,
|}>;

export const createFragment = <T>(fragment: any): FragmentType<T> => {
  const FragmentPrimitive = ({ children, relay, ...data }) => children(data);
  return createFragmentContainer(FragmentPrimitive, fragment);
};
