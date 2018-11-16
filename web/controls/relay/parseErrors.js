/* eslint-disable no-param-reassign */
/* @flow */

/**
 *   For any given pair - relay error array and withFormik value object
 *   returns an error and error object where all errors are combined and errors from
 *   non existed fields are added to error string
 *   see example below
 *
 *   // Relay errors
 *   const err = [
 *    {
 *      message: 'The request is invalid.',
 *      state: {
 *        organisation: ['You must be an admin.'],
 *        name: ['Your name is invalid', 'Name must not be the Ivan'],
 *        notExistedProp: ['Some weird error on non existed field', 'La la'],
 *      },
 *    },
 *    {
 *      message: 'Something bad happened',
 *    },
 *    {
 *      message: 'The request is invalid.',
 *      state: {
 *        organisation: ['You are not alone.'],
 *      },
 *    },
 *  ];
 *
 *  // withFormik values
 *  const vals = { organisation: true, name: true };
 *
 *  // call
 *  console.log(JSON.stringify(parseErrors(err, vals), null, ' '));
 *
 *  // -------------------------------------------------------------------
 *  // output
 *  {
 *    error: "Some weird error on non existed field, La la"
 *    errors: {
 *      "organisation": "You must be an admin., You are not alone.",
 *      "name": "Your name is invalid, Name must not be the Ivan",
 *    }
 *  }
 */

export type ValidationError = {
  message: string,
  state?: {
    [key: string]: Array<string>,
  },
};

const parseErrors = <T: {}>(
  errs: $ReadOnlyArray<ValidationError>,
  vals: T
): { error: ?string, errors: ?{ [key: $Keys<T>]: ?string } } => {
  const resErrs = [];
  const errors: { [key: $Keys<T>]: ?string } = {};

  errs.forEach(err => {
    if (!err.state) {
      resErrs.push(err.message);
    } else {
      Object.keys(err.state).forEach(stateKey => {
        if (err.state) {
          if (stateKey in vals) {
            const sk: $Keys<T> = (stateKey: any);
            const quote = stateKey in errors ? ',' : '';
            const errMsg = err.state[stateKey].join(', ');
            const prev: ?string = errors[sk];
            errors[sk] = `${prev || ''}${quote}${errMsg}`;
          } else {
            resErrs.push(err.state[stateKey]);
          }
        }
      });
    }
  });

  return {
    error: resErrs.length ? resErrs.join(', ') : undefined,
    errors: Object.keys(errors).length ? errors : undefined,
  };
};

export default parseErrors;
/*
const err = [
  {
    message: 'The request is invalid.',
    state: {
      organisation: ['You must be an admin.'],
      name: ['Your name is invalid', 'Name must not be the Ivan'],
      notExistedProp: ['Some weird error on non existed field', 'La la'],
    },
  },
  {
    message: 'Something bad happened',
  },
  {
    message: 'The request is invalid.',
    state: {
      organisation: ['You are not alone.'],
    },
  },
];
// withFormik values
const vals = { organisation: true, name: true };
// call
console.log(JSON.stringify(parseErrors(err, vals), null, ' '));
*/
