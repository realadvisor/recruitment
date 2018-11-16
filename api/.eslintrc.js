// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['airbnb-base', 'prettier'],
  plugins: ['flowtype', 'jest'],
  rules: {
    'flowtype/define-flow-type': 1,
    'no-restricted-properties': 'OFF',
    'import/prefer-default-export': 'OFF',
    'no-bitwise': 'OFF',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'import/extensions': 'off',
    'no-lonely-if': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-nested-ternary': 'off',
  },
  overrides: [
    {
      files: ['**/migrations/*.js', '**/scripts/*.js'],
      rules: {
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/mutations.js', '**/queries.js'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: ['**/__test__/**', '**/__tests__/**'],
      env: {
        'jest/globals': true,
      },
    },
  ],
};
