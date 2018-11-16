/* @flow */
import * as React from 'react';
import { Layout as LayoutControl } from '../controls/Layout';

type Props = {|
  children: React.Node,
|};

export const Layout = (props: Props) => (
  <LayoutControl>{props.children}</LayoutControl>
);
