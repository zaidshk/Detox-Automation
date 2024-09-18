import { expect } from '@jest/globals';
import { log } from 'detox';

import BasePage from '../../pages/BasePage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import SettingsPage from '../../pages/SettingsPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const data: [any] = require('../../data/ui-tests/menu/rtl.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'RTL Flow',
  ({
    featureId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    sofType,
    deleteApp,
    scenarioId,
  }) => {
    const dashboardPage = new DashboardPage();
    const settingsPage = new SettingsPage();
    const loginPage = new LoginPage();
    const basePage = new BasePage();

    beforeEach(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
        delete: deleteApp,
        launchArgs: {
          featureId: featureId,
          scenarioId: scenarioId,
          configType: 'mock',
        },
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

    it(`Verify ${scenarioId}`, async () => {
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
      if (scenarioId === 'SWITCH') {
        await dashboardPage.tapProfileBtn();
        await settingsPage.tapProfileBtn();

        await element(by.id('setting-item-language')).tap();
        await element(by.id('ProfileLanguageScreen-Arabic')).tap();
        await element(by.id('confirm-language-button')).tap();
      } else if (scenarioId === 'DASHBOARD') {
        const isDashboardVisible = await dashboardPage.isDashboardVisible();
        expect(isDashboardVisible).toEqual(true);
        const elementsArray = [
          'coreText-CurrentAmountText',
          'TopUpBtn',
          'SendMoneyBtn',
          'header-tab-1',
        ];
        await dashboardPage.validateAllElementsExist(elementsArray);
      } else if (scenarioId === 'ADDMONEY') {
        await dashboardPage.tapTopUpBtn();
        const isLoadPageVisible =
          (await dashboardPage.expectToExist('coreText-إضافة رصيد')) ||
          (await dashboardPage.expectToBeVisible('coreText-إضافة رصيد'));

        expect(isLoadPageVisible).toEqual(true);
      } else if (scenarioId === 'PROFILE') {
        await dashboardPage.tapProfileBtn();


        await basePage.expectToBeVisible('menu-item-help');
        await basePage.expectToBeVisible('menu-item-inviteFriend');
        await basePage.expectToBeVisible('menu-item-report');
        await basePage.expectToBeVisible('menu-item-profile');
        await basePage.expectToBeVisible('menu-item-authenticationTransaction');
        await basePage.expectToBeVisible('menu-item-source_of_funds');




      } else {
        await dashboardPage.tapSendBtn();
        const isSendMoneyVisible =
          (await dashboardPage.expectToExist('coreText-إرسال الأموال إلى')) ||
          (await dashboardPage.expectToBeVisible('coreText-إرسال الأموال إلى'));
        expect(isSendMoneyVisible).toEqual(true);
      }
    });

    afterEach(async () => {
      await attachDeviceScreenShotToReport(
        `${featureId - scenarioId}`,
        'Test End',
      );
    });

    afterAll(async () => {
      log.info('*** Final afterAll ***');
      device.terminateApp();
    });
  },
);
