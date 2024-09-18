import { expect } from '@jest/globals';
import { device, log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import TransactionDetailPage from '../../pages/TransactionDetailPage';
import TransactionHistoryPage from '../../pages/TransactionHistoryPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');
const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;

const data: [
  any,
] = require('../../data/ui-tests/transactionList/transactionDetails.json');

describe.each(data)(
  'Test: $featureId($scenarioId) for TransactionDetails screen',
  ({
    featureId,
    country,
    phoneNumber,
    passcode,
    logout,
    newInstance,
    deleteApp,
    senderCountryCode,
    scenarioId,
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
    );
    const dashboardPage = new DashboardPage();
    const transactionHistoryPage = new TransactionHistoryPage();
    const transactionDetailPage = new TransactionDetailPage();
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

      log.info(
        'should login ****',
        country,
        phoneNumber,
        passcode,
        process.env,

        globalAny,
      );
    });

    it('Validate Transaction Detail Screen', async () => {
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
      // const items = await transactionHistoryPage.fetchTransactionsItem();
      // log.info('items **', items);
      await element(by.id(`TransactionCell-0-touchable`)).tap();

      await attachDeviceScreenShotToReport(
        'DetailScreen',
        'Transaction Detail Screen',
      );

      const elementsArray = [
        'TransactionCell-transactionName',
        'TransactionCell-transactionTime',
        'TransactionCell-transactionAmount',
        'coreText-TransactionDetailNameID',
        'coreText-TransactionDetailValueID',
        'coreText-TransactionDetailNameStatus',
        'coreText-TransactionDetailValueStatus',
        'coreText-TransactionDetailNameFee',
        'coreText-TransactionDetailValueFee',
        'coreText-TransactionDetailNameVAT',
        'coreText-TransactionDetailValueVAT',
        'coreText-TransactionDetailNameDescription',
        'coreText-TransactionDetailValueDescription',
        'coreText-TransactionDetailNameCategory',
        'coreText-TransactionDetailValueCategory',
      ];
      await transactionDetailPage.validateAllElementsVisible(elementsArray);
    }, 300000);

    afterAll(async () => {});
  },
);
