module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "semi": "error",
    "no-undef": "off",
    "no-unused-vars": "off",
    "indent": ["error", 2]
  }
};
