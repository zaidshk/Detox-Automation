import { expect } from '@jest/globals';
import { device, log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import ManualBankTransferPage from '../../pages/ManualBankTransferPage';
import TopUpLoadChannelPage from '../../pages/TopUpLoadChannelPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const globalAny: any = global;

//import data from '../data/addMoney/manualBankTransfer.json';
// const data: [
//   any,
// ] = require(`../../data/${globalAny?.tester}/addMoney/manualBankTransfer.json`);
const data: [
  any,
] = require('../../data/ui-tests/addMoney/manualBankTransfer.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');

describe.each(data)(
  'Test $featureId($scenarioId) for Manual Bank Transfer',
  ({
    featureId,
    scenarioId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    amount,
    deleteApp,
    currency,
    newInstance,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      featureId,
      scenarioId,
      country,
      countryCode,
      phoneNumber,
      passcode,
      amount,
      currency,
      newInstance,
      deleteApp,
    );

    const dashboardPage = new DashboardPage();
    const manualBankPage = new ManualBankTransferPage();

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
    });

    it('Verify Manual Bank Transfer Flow', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

      let isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);

      await dashboardPage.tapTopUpBtn();
      const topUpLoadChannelPage = new TopUpLoadChannelPage();
      await topUpLoadChannelPage.tapOnBankLoad();
      //Assertion that bank transafer option is available
      //Validate from backend call or from data set
      await manualBankPage.tapManualBankTransferOption();

      //Check for Max and Min
      await manualBankPage.enterBankTransferAmount(`${amount}`);
      await manualBankPage.tapNextBtn();

      await attachDeviceScreenShotToReport(
        'ManualBankTransfer',
        'Manual Bank Detail Screen',
      );

      let elementsArray = [
        'coreText-name',
        'coreText-accountNumber',
        'coreText-iban',
        'coreText-currency',
        'coreText-country',
        'coreText-bankName',
        'coreText-branchName',
        'coreText-swiftCode',
        'coreText-userPhoneNumber',
      ];
      await manualBankPage.validateAllElementsExist(elementsArray);

      await manualBankPage.scrollToBottom('KeyboardAwareScrollView');
      await manualBankPage.enterTransactionId(`Test`);
      await device.disableSynchronization();
      await manualBankPage.tapNextBtn();
      await new Promise(resolve => setTimeout(resolve, 15000));

      elementsArray = [
        'coreText-ManualBankConfirmationScreen-title',
        'coreText-ManualBankConfirmationScreen-description',
      ];
      await manualBankPage.validateAllElementsExist(elementsArray);

      //'coreText-ManualBankConfirmationScreen-title'
      //coreText-ManualBankConfirmationScreen-description

      // await manualBankPage.verifyDescription(
      //   'coreText-ManualBankConfirmationScreen-title',
      //   'Pending',
      // );
      await manualBankPage.tapCloseBtn();
      await device.enableSynchronization();
      isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);
    }, 300000);

    afterEach(async () => {
      log.info('*** it afterEach ***');
      await attachDeviceScreenShotToReport('Screenshot', 'Test End');
    });

    afterAll(async () => {
      try {
        log.info('*** it afterAll ***');
      } catch (error) {
        log.info(`
          You did something wrong dummy!
         ${error}
        `);
        throw error;
      }
    });
  },
);
