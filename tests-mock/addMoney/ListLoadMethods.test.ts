import { expect } from '@jest/globals';
import { device, log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

//import data from '../data/addMoney/loadMethod.json';
const globalAny: any = global;
const data: [any] = require('../../data/ui-tests/addMoney/loadMethod.json');
const { exec } = require('child_process');
const { addAttach, addMsg } = require('jest-html-reporters/helper');

describe.each(data)(
  'Test $featureId($scenarioId) for $country with phoneNumber:$phoneNumber',
  ({
    featureId,
    scenarioId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    currency,
    deleteApp,
    newInstance,
    listLoadMethods,
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
      currency,
      listLoadMethods,
      accountId,
    );
    const dashboardPage = new DashboardPage();
    let loadMethods: string[] | null = null;

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
      loadMethods = listLoadMethods;
    });

    it('Verify Load Method', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

      const isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);

      await attachDeviceScreenShotToReport(
        `${phoneNumber}-loadMethod-dashboard`,
        'dashboard',
      );

      await dashboardPage.tapTopUpBtn();

      await attachDeviceScreenShotToReport(
        `${phoneNumber}-loadMethod-AddMoneyScreen`,
        'dashboard',
      );

      const isLoadPageVisible =
        (await dashboardPage.expectToExist('coreText-Top-up')) ||
        (await dashboardPage.expectToBeVisible('coreText-Top-up'));

      expect(isLoadPageVisible).toEqual(true);

      log.info('isLoadPageVisible', isLoadPageVisible);

      if (scenarioId === 'DATA') {
        for (let i = 0; i < loadMethods!.length; i++) {
          log.info('loadMethodsName testId', loadMethods);
          const loadname = loadMethods?.[i]!;
          const isLoadVisible =
            (await dashboardPage.expectToExist(loadname)) ||
            (await dashboardPage.expectToBeVisible(loadname));
          log.info('isLoadVisible **', isLoadVisible);

          await addMsg({
            message: `isLoadVisible ${loadname}: ${isLoadVisible}`,
          });
          expect(isLoadPageVisible).toEqual(true);
        }
      } else {
        log.info('Assert for Modal');
        const isModalVisible =
          (await dashboardPage.expectToExist('modal-title')) ||
          (await dashboardPage.expectToBeVisible('modal-title'));
        await addMsg({
          message: `isModalVisible: ${isModalVisible}`,
        });
        expect(isModalVisible).toEqual(true);
      }
    }, 300000);

    afterAll(async () => {
      try {
        log.info('*** it afterAll ***');
      } catch (error) {
        log.error(`
          Script Failed wrong!
         ${error}
        `);
        throw error;
      }
    });
  },
);
