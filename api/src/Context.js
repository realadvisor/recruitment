// @flow

/**
 * Copyright � 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable no-undef */ // TEMP

import DataLoader from 'dataloader';
import type { request as Request } from 'express';
import Validator from './Validator';
import { mapTo } from './schema/utils';
import { ValidationError } from './errors';

export class Context {
  request: Request;
  db: any;

  constructor(request: Request, db: any) {
    this.db = db;
    this.request = request;
  }

  properties = new DataLoader(keys =>
    this.db
      .table('properties')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  /*
   * Validation
   */

  validate(input: any) {
    const validator = new Validator(this, input, errors => {
      throw new ValidationError(errors);
    });

    return (apply: any) => {
      apply(validator);
      return validator.validate();
    };
  }
}

export default Context;
