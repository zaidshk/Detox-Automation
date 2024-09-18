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
] = require('../../data/ui-tests/transactionList/transactionFilter.json');

describe.each(data)(
  'Test $featureId($scenarioId) on TransactionFilter Screen',
  ({
    featureId,
    scenarioId,
    country,
    phoneNumber,
    passcode,
    logout,
    newInstance,
    deleteApp,
    senderCountryCode,
    categories,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      featureId,
      scenarioId,
      country,
      phoneNumber,
      passcode,
      newInstance,
      deleteApp,
      senderCountryCode,
      categories,
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

    it('Validate Filter Status List and category list', async () => {
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
      await transactionHistoryPage.openFilter();
      const statusArray = ['All', 'Confirmed', 'Approved', 'Failed'];
      //await transactionHistoryPage.validateAllElementsExist(statusArray);
      await transactionHistoryPage.validateAllElementsVisibleInList(
        statusArray,
        true,
        'TransactionStatusFilter',
        'right',
        20,
      );

      await attachDeviceScreenShotToReport('Filter', 'Filter Bottom Sheet');

      if (scenarioId === 'DATA') {
        // await transactionHistoryPage.validateAllElementsExist(categories);
        //const categoryList = categories.splice();
        await transactionHistoryPage.validateAllElementsVisibleInList(
          categories,
          true,
          'TransactionTypeList',
          'down',
          20,
        );
      } else {
        const exist = await transactionHistoryPage.expectToExist(categories[0]);

        await addMsg({
          message: `Is ${categories[0]} exist ${exist}`,
        });
        expect(false).toEqual(exist);
      }
    }, 300000);

    afterAll(async () => {});
  },
);
