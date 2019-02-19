module.exports.up = async db => {
  await db.schema.alterTable('properties', table => {
    table.float('land_surface');
    table.float('number_of_rooms');
    table.integer('number_of_parkings');
  });
};

module.exports.down = async db => {
  await db.schema.alterTable('properties', table => {
    table.dropColumn('land_surface');
    table.dropColumn('number_of_rooms');
    table.dropColumn('number_of_parkings');
  });
};

module.exports.config = { transaction: true };
