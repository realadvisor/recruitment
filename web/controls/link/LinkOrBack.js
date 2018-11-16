/* @flow */

import * as React from 'react';
import { RouterConsumer, WithRouter } from '../router';
import { Link } from './Link';

type ObjHref = {| +pathname: string, +query?: {} |};

export type Href = $Exact<ObjHref> | string;

type Props = {|
  href: Href,
  children: React.Node,
  match: (prevRoute: ObjHref | null, currRoute: ObjHref) => boolean,
|};

export const LinkOrBack = ({ href, match, children }: Props) => (
  <RouterConsumer>
    {({ prevRoute }) => (
      <WithRouter>
        {router => {
          if (
            match(prevRoute, { pathname: router.pathname, query: router.query })
          ) {
            return React.cloneElement(React.Children.only(children), {
              onClick: () => {
                router.back();
              },
            });
          }

          return <Link href={href}>{children}</Link>;
        }}
      </WithRouter>
    )}
  </RouterConsumer>
);
