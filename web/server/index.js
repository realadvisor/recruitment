require('flow-remove-types/register')({
  includes: /\/(?:server|utils)\//,
  excludes: /\/node_modules\//,
});
require('esm')(module)('./next');
