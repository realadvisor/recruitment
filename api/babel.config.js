module.exports = {
  presets: [['@babel/env', { targets: { node: 'current' } }], '@babel/flow'],
  plugins: ['@babel/proposal-class-properties'],
  retainLines: true,
};
