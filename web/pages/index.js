/* @flow */

import * as React from 'react';
import { Flex } from '@rebass/grid/emotion';
import Head from 'next/head';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from '../controls/link';

export default () => (
  <>
    <Head>
      <title>{'Home'}</title>
    </Head>

    <Flex justifyContent="center">
      <Paper
        css={{
          maxWidth: 960,
          marginTop: 16,
          marginBottom: 16,
          width: '100%',
          padding: 16,
        }}
      >
        <Typography variant="h6" css={{ marginBottom: 24 }}>
          Hello, Welcome to Total React Starter:
        </Typography>

        <Link href={{ pathname: '/property' }}>
          <Button
            to="/property"
            color="primary"
            variant="contained"
            css={{ marginTop: 24 }}
          >
            Start
          </Button>
        </Link>
      </Paper>
    </Flex>
  </>
);
