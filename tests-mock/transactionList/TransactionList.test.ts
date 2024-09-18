import { expect } from '@jest/globals';
import { device, log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import TransactionHistoryPage from '../../pages/TransactionHistoryPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');
const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;

const data: [
  any,
] = require('../../data/ui-tests/transactionList/transactionList.json');

describe.each(data)(
  'Test: $featureId($scenarioId) on TransactionList Screen',
  ({
    featureId,
    country,
    phoneNumber,
    passcode,
    logout,
    scenarioId,
    newInstance,
    deleteApp,
    senderCountryCode,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      featureId,
      country,
      phoneNumber,
      passcode,
      scenarioId,
      newInstance,
      deleteApp,
      senderCountryCode,
    );
    const dashboardPage = new DashboardPage();
    const transactionHistoryPage = new TransactionHistoryPage();

    beforeAll(async () => {
      await device.launchApp({
        launchArgs: {
          featureId: featureId,
          scenarioId: scenarioId,
          configType: 'mock',
        },
        newInstance: true,
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
    });

    it('Validate Transaction List Status', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(
        country,
        senderCountryCode,
        phoneNumber,
        passcode,
      );
      const isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);
      await dashboardPage.tapSeeAllBtn();
      await attachDeviceScreenShotToReport(
        'TransactionList',
        'Transaction List Screen',
      );

      const elementsArray = ['TransactionCell-0-touchable'];

      if (scenarioId === 'DATA') {
        await transactionHistoryPage.validateAllElementsExist(
          elementsArray,
          true,
        );
      } else {
        await transactionHistoryPage.validateAllElementsExist(
          elementsArray,
          false,
        );
      }
    }, 300000);

    afterAll(async () => {});
  },
);
