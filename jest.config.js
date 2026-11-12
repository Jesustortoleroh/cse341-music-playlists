module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'], // Search for test files with .test.ts extension
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true,
  forceExit: true,
  clearMocks: true
};