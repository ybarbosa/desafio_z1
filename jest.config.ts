module.exports = {
    projects: [
      {
        displayName: "unit-tests",
        testMatch: ["**/*.unit.spec.ts"],
        moduleFileExtensions: ["js", "json", "ts"],
        transform: {
          "^.+\\.(t|j)s$": "ts-jest"
        },
        moduleNameMapper: {
            "^src/(.*)$": "<rootDir>/src/$1"
        }
      },
      {
        displayName: "integration-tests",
        testMatch: ["**/*.integration.spec.ts"],
        moduleFileExtensions: ["js", "json", "ts"],
        moduleNameMapper: {
          "^src/(.*)$": "<rootDir>/src/$1"
        },
        transform: {
          "^.+\\.(t|j)s$": "ts-jest"
        },
      }
    ]
  };