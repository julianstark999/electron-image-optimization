module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/prettier',
    'plugin:tailwindcss/recommended',
  ],
  plugins: ['tailwindcss'],
  parserOptions: {
    ecmaVersion: 2020,
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    eqeqeq: ['error', 'always'],
    'new-parens': 'error',
    'brace-style': ['error', '1tbs'],
    'comma-style': ['error', 'last'],
    'linebreak-style': ['error', 'unix'],
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': 'error',
    'no-unused-vars': ['error', { args: 'none' }],
    'space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never' },
    ],
  },
};
