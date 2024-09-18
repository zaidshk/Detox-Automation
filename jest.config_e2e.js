/** @type {import('@jest/types').Config.InitialOptions} */
var currentdate = new Date();

module.exports = {
  rootDir: '..',
  testTimeout: 600000,
  maxWorkers: 4,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment', //'jest-circus-allure-environment', //'detox/runners/jest/testEnvironment', // 'jest-circus-allure-environment',
  // "testRunner": "jest-jasmine2",
  // testEnvironmentOptions: {
  //   "testPath": "Jest.config.rootDir"
  // },
  verbose: false,
  //setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  //testResultsProcessor: "./node_modules/jest-html-reporter",
  preset: 'ts-jest',
  // transform: {
  //   '^.+\\.ts?$': 'ts-jest',
  // },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  // globalSetup: '<rootDir>/automation/setup.ts',
  // globalTeardown: '<rootDir>/automation/teardown.ts',
  testMatch: ['<rootDir>/automation/tests-e2e/**/*.test.ts'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        pageTitle: 'Pyypl automation suite',
        publicPath:
          './html-reports/' +
          currentdate.getDate() +
          '-' +
          (currentdate.getMonth() + 1) +
          '-' +
          currentdate.getFullYear() +
          '@' +
          currentdate.getHours() +
          '.' +
          currentdate.getMinutes(),
        filename: 'report.html',
        openReport: true,
        includeConsoleLog: true,
        logoImgPath: 'automation/logo_pyypl.jpg',
        expand: true,
        urlForTestFiles:
          'https://bitbucket.org/pyypl/pyypl-mobile-app/src/master/',
      },
    ],
  ],
  displayName: {
    name: 'Pyypl',
    color: 'blue',
  },
  haste: {
    defaultPlatform: 'ios',
    platforms: ['ios', 'android'],
  },
  globals: {
    __DEV__: true,
    tester: 'CI',
    screenShotPath:
      '/html-reports/' +
      currentdate.getDate() +
      '-' +
      (currentdate.getMonth() + 1) +
      '-' +
      currentdate.getFullYear() +
      '@' +
      currentdate.getHours() +
      '.' +
      currentdate.getMinutes(),
  },
};
