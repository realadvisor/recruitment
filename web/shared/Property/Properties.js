/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { Flex, Box } from '@rebass/grid/emotion';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from '../../controls/link';

import { type FragmentRefs, createFragment } from '../../controls/relay';

import type { Property_property } from './__generated__/Property_property.graphql';

type PropertyData = {|
  lead?: Property_property,
|};

const PropertyFragment = createFragment<PropertyData>(
  graphql`
    fragment Properties_property on Property {
      id
      livingSurface
      landSurface
      numberOfRooms
      numberOfParkings
    }
  `
);

type Props = {|
  ...FragmentRefs<PropertyData>,
  step?: string,
|};

let id = 0;

const createData = (name, calories, fat, carbs, protein) => {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
};

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export const AllProperty = (props: Props) => {
  return (
    <>
      <PropertyFragment property={props.property}>
        {() => (
          <Box
            css={{
              maxWidth: 960,
              margin: '0 auto',
              width: '100%',
              padding: 16,
            }}
          >
            <Flex>
              <Link href={{ pathname: '/property' }}>
                <Button color="primary" variant="contained" to="/property">
                  Create New
                </Button>
              </Link>
            </Flex>
            <Flex justifyContent="center">
              <Paper
                css={{
                  maxWidth: 960,
                  marginTop: 16,
                  width: '100%',
                  padding: 16,
                }}
              >
                <>
                  <Typography variant="h6">Properties</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat (g)</TableCell>
                        <TableCell align="right">Carbs (g)</TableCell>
                        <TableCell align="right">Protein (g)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map(row => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.calories}</TableCell>
                          <TableCell align="right">{row.fat}</TableCell>
                          <TableCell align="right">{row.carbs}</TableCell>
                          <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              </Paper>
            </Flex>
          </Box>
        )}
      </PropertyFragment>
    </>
  );
};
