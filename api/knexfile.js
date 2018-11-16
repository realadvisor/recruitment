const dotenv = require('dotenv');

require('@babel/register');

dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

module.exports = {
  client: 'pg',
  connection: {},
  migrations: {
    tableName: 'migrations',
  },
};
