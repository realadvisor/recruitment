// @flow

// If foreign key doesn't follow le `${singlar(table)}_id` naming convention
export const columnAliases = {
  created_by: 'created_by',
  assigned_to: 'assigned_to',
};

// Mapping cross tables & aliases to the correct table
export const tableAliases = {
  // stages: 'lead_stages',
};
