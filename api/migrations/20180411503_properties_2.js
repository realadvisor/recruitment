/* prettier-ignore */

module.exports.up = async db => {
  console.log('Create properties table');
  await db.schema.alterTable('properties', async table => {
    table.float('land_surface')
  });
};

module.exports.down = async db => {
  await db.schema.alterTable('properties', async table => {
    table.deop('land_surface');
  });
};

module.exports.configuration = {
  transaction: true,
};
