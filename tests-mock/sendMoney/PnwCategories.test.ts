//https://jestjs.io/docs/manual-mocks
import { expect } from '@jest/globals';
import { device, log } from 'detox';

import { Category } from '../../../src/types/commons';
//import data from '../data/sendMoney/pnwCategories.json';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;
const data: [any] = require('../../data/ui-tests/sendMoney/pnwCategories.json');

describe.each(data)(
  'Test $featureId($scenarioId) for $country with phoneNumber:$phoneNumber',
  ({
    featureId,
    scenarioId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    senderCurrency,
    pnwCategories,
    deleteApp,
    newInstance,
    accountId,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      featureId,
      scenarioId,
      country,
      countryCode,
      phoneNumber,
      passcode,
      senderCurrency,
      newInstance,
      deleteApp,
      pnwCategories,
      accountId,
    );
    const dashboardPage = new DashboardPage();
    let categories: Category[] | null = null;

    beforeAll(async () => {
      log.info(
        '*****  beforeAll CUSTOM LAUNCH ARGS *******',
        device.appLaunchArgs.get(),
      );
      log.info(
        '***** beforeAll CUSTOM LAUNCH SHARED ARGS *******',
        device.appLaunchArgs.shared.get(),
      );

      await device.launchApp({
        launchArgs: {
          featureId: featureId,
          scenarioId: scenarioId,
          configType: 'mock',
        },
        newInstance: newInstance,
        delete: deleteApp,
        permissions: {
          location: 'always',
          notifications: 'YES',
          camera: 'YES',
          microphone: 'YES',
          contacts: 'YES',
          userTracking: 'YES',
        },
      });

      categories = pnwCategories; // await sendMoneyCategories(token, defaultAccount);
      await addMsg({
        message: `Categories for ${phoneNumber}: ${JSON.stringify(categories)}`,
      });
    });

    it('Verify PNW Categories', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

      const isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);

      await attachDeviceScreenShotToReport('dashboard', 'Senders dashboard');
      await dashboardPage.tapSendBtn();

      await attachDeviceScreenShotToReport(
        'categoryPage',
        'Senders Send PNW Category',
      );

      const isCategoryPageVisible =
        (await dashboardPage.expectToExist('coreText-Send money to')) ||
        (await dashboardPage.expectToBeVisible('coreText-Send money to'));

      expect(isCategoryPageVisible).toEqual(true);
      await addMsg({
        message: `isCategoryPageVisible: ${isCategoryPageVisible}`,
      });

      log.info('isCategoryPageVisible', isCategoryPageVisible);
      if (scenarioId === 'DATA') {
        for (let i = 0; i < categories!.length; i++) {
          log.info('pnwCategoryName testId', categories?.[i]);
          const categoryName = `coreText-${categories?.[i]}-mode-name`;
          const isCategoryVisible =
            (await dashboardPage.expectToExist(categoryName)) ||
            (await dashboardPage.expectToBeVisible(categoryName));
          log.info('isCategoryVisible', isCategoryVisible);
          await addMsg({
            message: `isCategoryPageVisible: ${isCategoryPageVisible}`,
          });

          expect(isCategoryPageVisible).toEqual(true);
        }
      } else {
        log.info('Assert for Modal');
        const isModalVisible =
          (await dashboardPage.expectToExist('modal-button-OK')) ||
          (await dashboardPage.expectToBeVisible('modal-button-OK'));

        await addMsg({
          message: `isModalVisible: ${isModalVisible}`,
        });
        expect(isModalVisible).toEqual(false);
      }
    }, 100000);
    afterEach(async () => {
      await attachDeviceScreenShotToReport('Test Finished', '');
    });
    afterAll(async () => {
      try {
        log.info('*** it afterAll ***');
      } catch (error) {
        log.error(`
          Script Failed !!!
         ${error}
        `);
        throw error;
      }
    });
  },
);
