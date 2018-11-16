/* @flow */

import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Flex } from '@rebass/grid/emotion';

type Props = {|
  children: React.Node,
|};

export const Layout = ({ children }: Props) => (
  <Flex
    flex="1"
    flexDirection="column"
    css={`
      min-width: 0;
    `}
  >
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Total React
        </Typography>
      </Toolbar>
    </AppBar>
    {children}
  </Flex>
);
