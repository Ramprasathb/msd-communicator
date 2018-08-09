module.exports = {
  extends: 'airbnb',
  plugins: ['react', 'jsx-a11y', 'import'],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/prefer-stateless-function': 0,
    'react/jsx-one-expression-per-line': 0,
    'max-len': 0,
    'react/prop-types': 0,
    'jsx-a11y/label-has-for': 0,
    'eact/no-unescaped-entities': 0,
    'no-unused-vars': 0,
    'react/no-unescaped-entities': 0,
    'react/destructuring-assignment': 0,
  },
  globals: {
    document: 1,
  },
  parser: 'babel-eslint',
  env: {
    browser: 1,
  },
};
