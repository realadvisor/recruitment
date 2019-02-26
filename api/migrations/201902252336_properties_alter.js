/* prettier-ignore */

module.exports.up = async db => {
  console.log('append land_surface, number_of_rooms, number_of_parkings to properties table');

  await db.schema.alterTable('properties', table => {
    table.float('land_surface');
    table.float('number_of_rooms');
    table.integer('number_of_parkings');
  });
};

module.exports.down = async db => {
  console.log('drop land_surface, number_of_rooms, number_of_parkings to properties table');

  await db.schema.alterTable('properties', table => {
    table.dropColumn('land_surface');
    table.dropColumn('number_of_rooms');
    table.dropColumn('number_of_parkings');
  });
};

module.exports.config = { transaction: true };
