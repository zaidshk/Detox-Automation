import { expect } from '@jest/globals';
import { log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import SettingsPage from '../../pages/SettingsPage';
import SourceOfFundsPage from '../../pages/SourceOfFundsPage';
import WalletLimitPage from '../../pages/WalletLimitPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

// const globalAny: any = global;
// const data: [any] = require(`../../data//settings/sof.json`);
const data: [any] = require('../../data/ui-tests/menu/walletLimit.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Wallet Limit',
  ({
    featureId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    sofType,
    deleteApp,
  }) => {
    const dashboardPage = new DashboardPage();
    const settingsPage = new SettingsPage();
    const loginPage = new LoginPage();
    const sourceOfFundsPage = new SourceOfFundsPage();
    const walletLimit = new WalletLimitPage();

    beforeEach(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
        delete: deleteApp,
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

    it(`Verify Wallet Limit`, async () => {
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
      await dashboardPage.tapProfileBtn();
      await settingsPage.tapWalletLimitBtn();
      //coreText-menu-item-wallet-limit-value
      //let walletLimitTitle: any = await walletLimit.verifyTitle();
      // await addMsg({
      //   message: `Verify the user navigated to Source Of Funds page:${
      //     walletLimitTitle === 'Wallet Limit' ? 'PASS' : 'FAIL'
      //   }`,
      // });
      // expect(walletLimitTitle).not.toBeNull();

      const elementsArray = [
        'coreText-walletLimitViewHeaderTitle',
        'coreText-walletLimitViewHeaderBody',
        'walletLimitActionCell-inputCell-title',
        'walletLimitTextInput',
        'edit-touchable',
        'nextBtn',
      ];

      await walletLimit.validateAllElementsVisible(elementsArray);

      //Send less then balance of 800
      //Validate for popup

      await walletLimit.editWalletLimit('300');
      await walletLimit.tapConfirmBtn();

      const popUpElement = [
        'modal-title',
        'modal-subtitle',
        'modal-button-Okay',
      ];

      await attachDeviceScreenShotToReport(
        'editWalletLimit',
        'Wallet Limit Less then Balance',
      );

      //Press modal-button-Okay
      await walletLimit.validateAllElementsVisible(popUpElement);
      await walletLimit.tapModalOkayButton();

      await walletLimit.editWalletLimit('9000');
      await device.disableSynchronization();
      await walletLimit.tapConfirmBtn();

      // set timeout for 5 second
      await new Promise(resolve => setTimeout(resolve, 5000));

      //Press modal-button-Okay
      await attachDeviceScreenShotToReport(
        `${featureId}`,
        'Wallet Limit in Range',
      );
      await walletLimit.validateAllElementsVisible(popUpElement);

      await walletLimit.tapModalOkayButton();
      await device.enableSynchronization();

      // Increase wallet limit more then 300000
      await walletLimit.editWalletLimit('3000000');
      // walletLimitWarningText is visible
      const isWarningVisible = await walletLimit.walletLimitWarningVisible();
      log.info('isWarningVisible', isWarningVisible);
      expect(isWarningVisible).toEqual(true);

      await walletLimit.tapConfirmBtn();

      await attachDeviceScreenShotToReport(
        'editWalletLimit',
        'Max Wallet Limit',
      );

      const uploadElement = [
        'coreText-documentsUploadViewHeaderTitle',
        'coreText-documentsUploadViewHeaderBody',
        'uploadIconTouchable',
        'uploadDocuments-title',
        'uploadDocuments-description',
      ];

      await walletLimit.validateAllElementsVisible(uploadElement);

      await attachDeviceScreenShotToReport(
        'Upload documents screen',
        'Upload documents screen',
      );
    });

    afterEach(async () => {
      await attachDeviceScreenShotToReport(`${featureId}`, 'Test End');
    });

    afterAll(async () => {
      log.info('*** Final afterAll ***');
      device.terminateApp();
    });
  },
);
