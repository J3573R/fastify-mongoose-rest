/** @type {import('jest').Config} */
module.exports = {
  verbose: true,
  preset: '@shelf/jest-mongodb',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/build', 'tests'],
  watchPathIgnorePatterns: ['globalConfig'],
  testPathIgnorePatterns: ['/node_modules/', 'build', 'coverage'],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
