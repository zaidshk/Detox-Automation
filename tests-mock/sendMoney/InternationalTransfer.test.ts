//https://jestjs.io/docs/manual-mocks
import { expect } from '@jest/globals';
import { device, log } from 'detox';

//import data from '../data/sendMoney/pnwCategories.json';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import SendMoneyAmountPage from '../../pages/SendMoneyAmountPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;
const data: [
  any,
] = require('../../data/ui-tests/sendMoney/internationalRemittance.json');

describe.each(data)(
  'Test International Remittance ($featureId)',
  ({
    featureId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    senderCurrency,
    pnwCategories,
    deleteApp,
    newInstance,
    accountId,
    route,
    receiverCountry,
    receiver,
    firstName,
    lastName,
    ifscCode,
    accountNumber,
    documentNumber,
    mode,
    payoutTarget,
    amount,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      featureId,
      country,
      countryCode,
      phoneNumber,
      passcode,
      senderCurrency,
      newInstance,
      deleteApp,
      pnwCategories,
      accountId,
      route,
      receiverCountry,
      receiver,
      firstName,
      lastName,
      ifscCode,
      accountNumber,
      documentNumber,
      mode,
      payoutTarget,
      amount,
    );
    const dashboardPage = new DashboardPage();
    const sendMoneyAmountPage = new SendMoneyAmountPage();

    beforeAll(async () => {
      //Copy pnwCategories.json
      // exec(
      //   `cp e2e/data/mocks/pnwCategoriesData.json mockServer/src/json/account_${accountId}/pnwCategories.json`,
      //   (err: any, stdout: any, stderr: any) => {
      //     log.info('pnwCategoriesData copy completed - ', err, stdout, stderr);
      //   },
      // );

      // //Copy listAvailableTransferRoutes.json
      // if (testID === 'BANK_MODE' || testID === 'CASH_MODE') {
      //   exec(
      //     `cp e2e/data/mocks/INTERNATIONAL_TRANSFER_IN_listAvailableTransferRoutes.json mockServer/src/json/account_${accountId}/INTERNATIONAL_TRANSFER_IN_listAvailableTransferRoutes.json`,
      //     (err: any, stdout: any, stderr: any) => {
      //       log.info(
      //         'INTERNATIONAL_TRANSFER_IN_listAvailableTransferRoutes copy completed - ',
      //         err,
      //         stdout,
      //         stderr,
      //       );
      //     },
      //   );
      // } else if (testID === 'WALLET_MODE') {
      //   exec(
      //     `cp e2e/data/mocks/INTERNATIONAL_TRANSFER_CN_listAvailableTransferRoutes.json mockServer/src/json/account_${accountId}/INTERNATIONAL_TRANSFER_CN_listAvailableTransferRoutes.json`,
      //     (err: any, stdout: any, stderr: any) => {
      //       log.info(
      //         'INTERNATIONAL_TRANSFER_CN_listAvailableTransferRoutes completed - ',
      //         err,
      //         stdout,
      //         stderr,
      //       );
      //     },
      //   );
      // }

      //Copy estimateCharge.json
      // exec(
      //   `cp e2e/data/mocks/spendExternalFXPayment_estimateCharge.json mockServer/src/json/account_${accountId}/spendExternalFXPayment_estimateCharge.json`,
      //   (err: any, stdout: any, stderr: any) => {
      //     log.info(
      //       'spendExternalFXPayment_estimateCharge copy completed - ',
      //       err,
      //       stdout,
      //       stderr,
      //     );
      //   },
      // );

      await device.launchApp({
        launchArgs: { featureId: featureId, configType: 'mock' },
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
      // await device.disableSynchronization();
    });

    // it('Verify Login Feature', async () => {
    //   log.info('should login ****', country, phoneNumber, passcode);
    //   const loginPage = new LoginPage();
    //   await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
    // });

    it('International Transfer Flow', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

      const isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toBe(true);

      //await device.disableSynchronization();
      await attachDeviceScreenShotToReport(
        `${phoneNumber}_dashboard`,
        'Senders dashboard',
      );
      await dashboardPage.tapSendBtn();

      await attachDeviceScreenShotToReport(
        `${phoneNumber}_categoryPage`,
        'Senders Send PNW Category',
      );

      const isCategoryPageVisible =
        (await dashboardPage.expectToExist('coreText-Send money to')) ||
        (await dashboardPage.expectToBeVisible('coreText-Send money to'));

      // let assert = jestExpect(
      //   `isCategoryVisible : ${isCategoryPageVisible}`,
      //   isCategoryPageVisible,
      //   true,
      //   JestType.equals,
      // );
      await addMsg({
        message: `isCategoryPageVisible: ${isCategoryPageVisible}`,
      });
      expect(isCategoryPageVisible).toBe(true);

      await device.disableSynchronization();
      await dashboardPage.clickById(`${route}-mode`);
      await new Promise(resolve => setTimeout(resolve, 10000));

      const isAmountPageVisible =
        (await dashboardPage.expectToExist('coreText-Send Money')) ||
        (await dashboardPage.expectToBeVisible('coreText-Send Money'));

      await addMsg({
        message: `isAmountPageVisible: ${isAmountPageVisible}`,
      });
      expect(isAmountPageVisible).toBe(true);

      await sendMoneyAmountPage.openCountrySelector();
      await sendMoneyAmountPage.searchCountry(receiverCountry);
      await new Promise(resolve => setTimeout(resolve, 10000));
      const isModeVisible =
        (await sendMoneyAmountPage.expectToExist(
          'mode-optionCell-chevronDown-imageSVG-icon',
        )) ||
        (await sendMoneyAmountPage.expectToBeVisible(
          'mode-optionCell-chevronDown-imageSVG-icon',
        ));
      if (isModeVisible) {
        await sendMoneyAmountPage.waitAndClickById('mode');

        await sendMoneyAmountPage.waitAndClickById(
          `${mode}`,
          5000,
        );
      }
      const isPayoutTargetVisible =
        (await sendMoneyAmountPage.expectToExist(
          'payoutTarget-optionCell-chevronDown-imageSVG-icon',
        )) ||
        (await sendMoneyAmountPage.expectToBeVisible(
          'payoutTarget-optionCell-chevronDown-imageSVG-icon',
        ));
      if (isPayoutTargetVisible) {
        await sendMoneyAmountPage.waitAndClickById('payoutTarget');
        await sendMoneyAmountPage.waitAndClickById(
          `${payoutTarget}`,
        );
      }

      await sendMoneyAmountPage.enterRemittanceAmount(amount);

      await sendMoneyAmountPage.waitAndClickById('next');
      await attachDeviceScreenShotToReport('amountPage', 'Amount Page Details');
      await device.enableSynchronization();

      const isBeneficiaryPageVisible =
        (await dashboardPage.expectToExist('coreText-Beneficiary')) ||
        (await dashboardPage.expectToBeVisible('coreText-Beneficiary'));

      await addMsg({
        message: `isBeneficiaryPageVisible: ${isBeneficiaryPageVisible}`,
      });
      expect(isBeneficiaryPageVisible).toBe(true);

      await device.disableSynchronization();
      await sendMoneyAmountPage.enterBenificiaryDetails(
        firstName,
        lastName,
        receiver,
      );
      await sendMoneyAmountPage.fillBenificiaryFormForBankMode(
        documentNumber,
        accountNumber,
        ifscCode,
        mode,
      );

      await attachDeviceScreenShotToReport(
        'BeneficiaryScreen',
        'Beneficiary Page Details',
      );
      await device.enableSynchronization();
      await sendMoneyAmountPage.clickById('NextBtn-beneficiaryScreen-button');

      const isCheckoutPageVisible =
        (await dashboardPage.expectToExist('coreText-Checkout')) ||
        (await dashboardPage.expectToBeVisible('coreText-Checkout'));

      await addMsg({
        message: `isCheckoutPageVisible: ${isCheckoutPageVisible}`,
      });
      expect(isCheckoutPageVisible).toBe(true);

      await attachDeviceScreenShotToReport(
        'RemittanceCheckout',
        'Remittance Checkout Page',
      );

      await sendMoneyAmountPage.clickById('next');

      await sendMoneyAmountPage.waitAndClickById('modal-button-OK', 10000);
      await attachDeviceScreenShotToReport(
        'ConfirmationScreen',
        'Beneficiary Page Details',
      );

      await sendMoneyAmountPage.waitAndClickById('backHome');
    }, 600000);

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
