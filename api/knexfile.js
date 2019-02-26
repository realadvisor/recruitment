const dotenv = require('dotenv');

require('@babel/register');

dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.PG_LISTINGS_HOST,
    user: process.env.PG_LISTINGS_USER,
    password: process.env.PG_LISTINGS_PASSWORD,
    database: process.env.PG_LISTINGS_DATABASE,
  },
  migrations: {
    tableName: 'migrations',
  },
};
