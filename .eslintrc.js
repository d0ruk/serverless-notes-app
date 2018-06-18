module.exports = {
  parser: "babel-eslint",
  extends: ["eslint:recommended"],
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    "comma-dangle": 0,
    "no-use-before-define": [2, "nofunc"],
    "no-unused-vars": 1,
    "no-undef": 2,
    "no-const-assign": 2,
    "no-console": 1,
    "constructor-super": 1,
    "valid-typeof": 1,
    "no-this-before-super": 1,
    "no-irregular-whitespace": 1,
    "no-unexpected-multiline": 1,
    "no-unreachable": 2,
    "no-dupe-args": 2,
    "no-dupe-keys": 2,
    "default-case": 2,
    eqeqeq: 1,
    "guard-for-in": 2
  }
};
