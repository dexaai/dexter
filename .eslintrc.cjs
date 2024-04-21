/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@dexaai/eslint-config', '@dexaai/eslint-config/node'],
  ignorePatterns: ['.next/', 'dist/', 'node_modules/'],
  rules: {
    'no-console': 'off',
  },
};
