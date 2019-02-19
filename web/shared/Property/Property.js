/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { Flex, Box } from '@rebass/grid/emotion';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import validator from 'validator';

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
      livingSurface
      landSurface
      numberOfRooms
      numberOfParkings
    }
  `
);

const PropertyUpsertLead = createMutation<PropertyUpsertMutation, {}>(graphql`
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
`);

type Props = {|
  ...FragmentRefs<PropertyData>,
  step?: string,
|};

const textCss = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid #a1a1a1',
  outline: 'none',
};

const boxWrapper = {
  display: 'flex',
  flexDirection: 'column',
  background: '#ededed',
  padding: '7px 12px',
  borderRadius: '5px',
  marginBottom: 15,
  marginRight: 15,
};

const errorCss = {
  fontSize: 12,
  marginTop: 5,
};

const labelCss = {
  fontSize: 14,
};
export const Property = (props: Props) => {
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
              <Link href={{ pathname: '/properties' }}>
                <Button color="primary" variant="contained" to="/properties">
                  Back to List
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
                <PropertyUpsertLead>
                  {PropertyUpsertMutation => (
                    <>
                      <Typography variant="h6">Property</Typography>
                      <Formik
                        initialValues={{
                          livingSurface: '',
                          landSurface: '',
                          numberOfRooms: '',
                          numberOfParkings: '',
                        }}
                        validate={values => {
                          let errors = {};
                          if (!values.livingSurface) {
                            errors.livingSurface = 'Required';
                          } else if (!validator.isFloat(values.livingSurface)) {
                            errors.livingSurface =
                              'Living Surface must be number';
                          }
                          if (!values.landSurface) {
                            errors.landSurface = 'Required';
                          } else if (!validator.isFloat(values.landSurface)) {
                            errors.landSurface = 'Land Surface must be number';
                          }
                          if (!values.numberOfRooms) {
                            errors.numberOfRooms = 'Required';
                          } else if (!validator.isInt(values.numberOfRooms)) {
                            errors.numberOfRooms =
                              'Number of rooms must be number';
                          }
                          if (!values.numberOfParkings) {
                            errors.numberOfParkings = 'Required';
                          } else if (
                            !validator.isInt(values.numberOfParkings)
                          ) {
                            errors.numberOfParkings =
                              'Number of Parkings must be number';
                          }
                          return errors;
                        }}
                        onSubmit={values => {
                          PropertyUpsertMutation.mutate({
                            property: { ...values },
                          });
                        }}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                        }) => (
                          <form onSubmit={handleSubmit}>
                            <Box css={{ display: 'flex' }}>
                              <Box css={boxWrapper}>
                                <label css={labelCss} htmlFor="livingSurface">
                                  Living Surface
                                </label>
                                <input
                                  type="text"
                                  name="livingSurface"
                                  id="livingSurface"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  css={textCss}
                                  value={values.livingSurface}
                                />
                                <Box css={errorCss}>
                                  {errors.livingSurface &&
                                    touched.livingSurface &&
                                    errors.livingSurface}
                                </Box>
                              </Box>
                              <Box css={boxWrapper}>
                                <label css={labelCss} htmlFor="landSurface">
                                  Land Surface
                                </label>
                                <input
                                  type="text"
                                  name="landSurface"
                                  id="landSurface"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.landSurface}
                                  css={textCss}
                                />
                                <Box css={errorCss}>
                                  {errors.landSurface &&
                                    touched.landSurface &&
                                    errors.landSurface}
                                </Box>
                              </Box>
                            </Box>
                            <Box css={{ display: 'flex' }}>
                              <Box css={boxWrapper}>
                                <label css={labelCss} htmlFor="numberOfRooms">
                                  Number of Rooms
                                </label>
                                <input
                                  type="text"
                                  name="numberOfRooms"
                                  id="numberOfRooms"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.numberOfRooms}
                                  css={textCss}
                                />
                                <Box css={errorCss}>
                                  {' '}
                                  {errors.numberOfRooms &&
                                    touched.numberOfRooms &&
                                    errors.numberOfRooms}
                                </Box>
                              </Box>
                              <Box css={boxWrapper}>
                                <label
                                  css={labelCss}
                                  htmlFor="numberOfParkings"
                                >
                                  Number of Parking
                                </label>
                                <input
                                  type="text"
                                  name="numberOfParkings"
                                  id="numberOfParkings"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.numberOfParkings}
                                  css={textCss}
                                />
                                <Box css={errorCss}>
                                  {errors.numberOfParkings &&
                                    touched.numberOfParkings &&
                                    errors.numberOfParkings}
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              <Flex justifyContent="flex-end">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  type="submit"
                                >
                                  Submit
                                </Button>
                              </Flex>
                            </Box>
                          </form>
                        )}
                      </Formik>
                    </>
                  )}
                </PropertyUpsertLead>
              </Paper>
            </Flex>
          </Box>
        )}
      </PropertyFragment>
    </>
  );
};
