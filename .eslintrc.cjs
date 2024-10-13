/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@dexaai/eslint-config/node'],
  ignorePatterns: ['.next/', 'dist/', 'node_modules/', 'docs/'],
  rules: {
    '@typescript-eslint/naming-convention': 'off',
    'no-console': 'off',
  },
};
