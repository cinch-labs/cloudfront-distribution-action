module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'no-console': 1,
    'prefer-template': 1,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
}
