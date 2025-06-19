export default {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      useESM: true,
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular'
  },
  moduleNameMapper: {
    '\\.(scss|css|less)$': 'identity-obj-proxy'  // ⬅ mock style files
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  testEnvironment: 'jsdom',
};
