module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*',
  ],
  coverageReporters: process.env.COVERALLS_REPO_TOKEN ? ['text-lcov', 'coveralls'] : ['text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    }
  }
};
