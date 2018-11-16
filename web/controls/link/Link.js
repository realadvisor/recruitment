/* @flow */

import * as React from 'react';
import NextLink from 'next/link';
import { getConfig } from '../../utils/getConfig';
import { toAsUrl } from '../../utils/rewrites';
import { WithRouter } from '../router';

type ObjHref = {| +pathname: string, +query?: {} |};

export type Href = $Exact<ObjHref> | string;

type Props = {|
  href: Href | string,
  children:
    | (({
        href: string,
        onClick: (SyntheticMouseEvent<>) => void,
      }) => React.Node)
    | React.Node,
  external?: boolean,
  prefetch?: boolean,
|};

const {
  publicRuntimeConfig: { rewrites, peekKeysFromCurrentRoute },
} = getConfig();

const CallHref = ({
  href,
  onClick,
  children,
}: {|
  href?: string,
  onClick?: (SyntheticMouseEvent<>) => void,
  children: ({
    href: string,
    onClick: (SyntheticMouseEvent<>) => void,
  }) => React.Node,
|}) => {
  if (href == null || onClick == null) return null;
  return children({ href, onClick });
};

export const Link = ({ href, external, children, prefetch }: Props) => (
  <WithRouter>
    {router => {
      const res = toAsUrl(rewrites, peekKeysFromCurrentRoute, href, router);

      return external === true ? (
        React.cloneElement(React.Children.only(children), {
          href: res && res.as,
        })
      ) : (
        <NextLink
          href={res && res.href}
          as={res && res.as}
          passHref
          prefetch={prefetch}
        >
          {typeof children === 'function' ? (
            <CallHref>{children}</CallHref>
          ) : (
            children
          )}
        </NextLink>
      );
    }}
  </WithRouter>
);
