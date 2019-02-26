/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import Router from 'next/router';
import { Flex } from '@rebass/grid/emotion';
import { Formik, Field } from 'formik';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { Link } from '../../controls/link';

import {
  type FragmentRefs,
  createFragment,
  createMutation,
} from '../../controls/relay';

import type { Property_property } from './__generated__/Property_property.graphql';
import type { PropertyUpsertMutation } from './__generated__/PropertyUpsertMutation.graphql';

type PropertyData = {|
  lead?: Property_property,
|};

const PropertyFragment = createFragment<PropertyData>(
  graphql`
    fragment Property_property on Property {
      id
      numberOfRooms
      livingSurface
      landSurface
      numberOfParkings
    }
  `
);

const PropertyUpsertProperty = createMutation<PropertyUpsertMutation, {}>(
  graphql`
    mutation PropertyUpsertMutation($input: UpsertPropertyInput!) {
      upsertProperty(input: $input) {
        property {
          id
          livingSurface
          landSurface
          numberOfRooms
          numberOfParkings
        }
      }
    }
  `
);

type Props = {|
  ...FragmentRefs<PropertyData>,
  step?: string,
|};

export const Property = (props: Props) => {
  return (
    <PropertyFragment property={props.property}>
      {({ property }) => (
        <Flex alignItems="center" flexDirection="column">
          <div css={{ maxWidth: 960, marginTop: 16, width: '100%' }}>
            <Link href={{ pathname: '/properties' }}>
              <Button to="/properties" color="primary" variant="contained">
                Back to List
              </Button>
            </Link>
          </div>

          <Paper
            css={{ maxWidth: 960, marginTop: 16, width: '100%', padding: 16 }}
          >
            <PropertyUpsertProperty>
              {({ mutate }) => (
                <Formik
                  initialValues={{ ...property }}
                  onSubmit={values => {
                    mutate({ property: values });
                    Router.push('/properties');
                  }}
                  render={props => (
                    <form onSubmit={props.handleSubmit}>
                      <Grid container spacing={16}>
                        <Grid item xs={6}>
                          <Field
                            name="livingSurface"
                            render={({ field /* _form */ }) => (
                              <TextField
                                {...field}
                                label="Living surface"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="landSurface"
                            render={({ field /* _form */ }) => (
                              <TextField
                                {...field}
                                label="Land surface"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="numberOfRooms"
                            render={({ field /* _form */ }) => (
                              <TextField
                                {...field}
                                label="Number of rooms"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="numberOfParkings"
                            render={({ field /* _form */ }) => (
                              <TextField
                                {...field}
                                label="Number of parkings"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Flex
                        css={{ width: '100%', marginTop: 16 }}
                        justifyContent="flex-end"
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                        >
                          Save
                        </Button>
                      </Flex>
                    </form>
                  )}
                />
              )}
            </PropertyUpsertProperty>
          </Paper>
        </Flex>
      )}
    </PropertyFragment>
  );
};
