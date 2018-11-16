/* @flow */

import * as React from 'react';
import { WithRouter, type Router } from './WithRouter';

type Href = {| +pathname: string, +query: { [string]: string } |};

const RouterCtx = React.createContext<{| prevRoute: Href | null |}>({
  prevRoute: null,
});

export const RouterConsumer = RouterCtx.Consumer;

class RouterProviderImpl extends React.Component<
  {|
    router: Router,
    children: React.Node,
  |},
  {|
    prevRoute: Href | null,
    currentRoute: Href,
  |}
> {
  state = {
    prevRoute: null,
    currentRoute: {
      pathname: this.props.router.pathname,
      query: this.props.router.query,
    },
  };

  static getDerivedStateFromProps(props, state) {
    if (state.currentRoute.pathname !== props.router.pathname) {
      const { pathname, query } = props.router;
      return {
        prevRoute: state.currentRoute,
        currentRoute: { pathname, query },
      };
    }
    return null;
  }

  render() {
    const {
      state: { prevRoute },
      props: { children },
    } = this;

    return (
      <RouterCtx.Provider value={{ prevRoute }}>{children}</RouterCtx.Provider>
    );
  }
}

export const RouterProvider = ({ children }: { children: React.Node }) => (
  <WithRouter>
    {router => (
      <RouterProviderImpl router={router}>{children}</RouterProviderImpl>
    )}
  </WithRouter>
);
