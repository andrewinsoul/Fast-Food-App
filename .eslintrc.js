module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true,
        "browser": true,
        "es6": true,
        "mocha": true,
        "commonjs": true,
        "jquery": true
      },
      "rules": {
        "one-var": 0,
        "no-console": 0,
        "import/no-extraneous-dependencies": 0,
        "no-restricted-globals": 0,
        "one-var-declaration-per-line": 0,
        "new-cap": 0,
        "max-len": [1, 80, 2],
        "consistent-return": 0,
        "no-param-reassign": 0,
        "no-useless-escape": 0,
        "class-methods-use-this": 0,
        "no-case-declarations": 0,
        "comma-dangle": 0,
        "curly": ["error", "multi-line"],
        "import/no-unresolved": [2, { "commonjs": true }],
        "no-shadow": ["error", { "allow": ["req", "res", "err"] }],
        "valid-jsdoc": ["error", {
          "requireReturn": true,
          "requireReturnType": true,
          "requireParamDescription": false,
          "requireReturnDescription": true
        }],
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": true,
                "MethodDefinition": true,
                "ClassDeclaration": true
            }
        }]
      }
};
