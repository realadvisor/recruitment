/* prettier-ignore */

module.exports.up = async db => {
  console.log('Add name and number of rooms in properties table');
  await db.schema.alterTable('properties', async table => {
    table.string('name')
    table.float('number_of_rooms')
  });
};

module.exports.down = async db => {
  console.log('Remove name and number of rooms in properties table');
  await db.schema.alterTable('properties', async table => {
    table.dropColumn('name');
    table.dropColumn('number_of_rooms');
  });
};

module.exports.configuration = {
  transaction: true,
};
