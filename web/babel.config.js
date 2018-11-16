module.exports = {
  presets: [
    'next/babel',
    '@babel/flow',
    // process.env.NODE_ENV === 'test' && '@babel/env',
  ].filter(Boolean),
  plugins: [
    'relay',
    ['@babel/proposal-optional-chaining', { loose: true }],
    process.env.NODE_ENV === 'production'
      ? [
          'emotion',
          {
            autoLabel: true,
            sourceMap: false,
          },
        ]
      : [
          'emotion',
          {
            autoLabel: true,
            hoist: true,
          },
        ],
  ],
};
