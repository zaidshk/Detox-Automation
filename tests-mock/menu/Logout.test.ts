import { expect } from '@jest/globals';
import { log } from 'detox';

import { testIDs } from '../../../src/testIds/testId';
import DashboardPage from '../../pages/DashboardPage';
import HomeMenu from '../../pages/HomeMenu';
import LoginPage from '../../pages/LoginPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');

const globalAny: any = global;
const data: [any] = require('../../data/ui-tests/menu/logout.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Logout ($featureId)',
  ({
    featureId,
    country,
    countryCode,
    passcode,
    phoneNumber,
    newInstance,
    logout,
    userType,
    accountCards,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      country,
      countryCode,
      passcode,
      phoneNumber,
      newInstance,
      logout,
      userType,
      accountCards,
      featureId,
    );
    const dashboardPage = new DashboardPage();

    beforeAll(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
        launchArgs: { featureId: featureId, configType: 'mock' },
        newInstance: true,
        permissions: {
          location: 'always',
          notifications: 'YES',
          camera: 'YES',
          microphone: 'YES',
          contacts: 'YES',
          userTracking: 'YES',
        },
      });
    });
    it('Logout', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

      let isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);

      await dashboardPage.tapProfileBtn();

      const menuPage = new HomeMenu();
      await menuPage.logOut();

      const isLoginPage = await loginPage.expectToBeVisible(testIDs.LoginBtn);
      expect(isLoginPage).toEqual(true);
      // await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

      // isDashboardVisible = await dashboardPage.isDashboardVisible();
      // expect(isDashboardVisible).toEqual(true);
    }, 300000);

    afterEach(async () => {
      await attachDeviceScreenShotToReport('Test Finished', '');
    });

    afterAll(async () => {
      log.info('*** Final afterAll ***');
      device.terminateApp();
    });
  },
);
