/* prettier-ignore */

module.exports.up = async db => {
  console.log('Create properties table');

  await db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  .then(async () => {
    await db.schema.alterTable('properties', async table => {
      table.float('land_surface')
    });
  });

};

module.exports.down = async db => {
  await db.schema.alterTable('properties', async table => {
    table.dropColumn('land_surface');
  });
};

module.exports.configuration = {
  transaction: true,
};
