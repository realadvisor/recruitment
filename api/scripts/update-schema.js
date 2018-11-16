/* eslint-disable global-require, import/no-unresolved */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { printSchema } = require('graphql');

dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

console.log('Update schema.graphql');

const { default: schema } = require('../build/schema');

const options = { commentDescriptions: true };
const file = path.resolve(__dirname, '../schema.graphql');
const source = printSchema(schema, options);

fs.writeFileSync(file, source, 'utf8');
