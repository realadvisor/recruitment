/* @flow */
import * as React from 'react';
import { withRouter } from 'next/router';

type Href = {| +pathname: string, +query: { [string]: string } |};

export type Router = {|
  ...Href,
  replace: (Href, Href, { shallow: boolean }) => void,
  back: () => void,
|};

export const WithRouter: React.ComponentType<{|
  children: Router => React.Node,
|}> = withRouter(
  ({
    router,
    children,
  }: {|
    router: Router,
    children: Router => React.Node,
  |}) => children(router)
);
