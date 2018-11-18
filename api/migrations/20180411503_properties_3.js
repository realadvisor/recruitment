/* prettier-ignore */

module.exports.up = async db => {
  console.log('Add parkings in properties table');
  await db.schema.alterTable('properties', async table => {
    table.integer('number_of_parkings')
  });
};

module.exports.down = async db => {
  console.log('Remove parkings from properties table');
  await db.schema.alterTable('properties', async table => {
    table.dropColumn('number_of_parkings');
  });
};

module.exports.configuration = {
  transaction: true,
};
