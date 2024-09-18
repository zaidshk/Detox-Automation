import { expect } from '@jest/globals';
import { device, log } from 'detox';

import { testIDs } from '../../../src/testIds/testId';
//import data from '../data/sendMoney/sendMoneyP2P.json';
import CountryCodeBottomSheetPage from '../../pages/CountryCodeBottomSheetPage';
import DashboardPage from '../../pages/DashboardPage';
import HomeMenu from '../../pages/HomeMenu';
import LoginPage from '../../pages/LoginPage';
import PhoneNumberInputPage from '../../pages/PhoneNumberInputPage';
import SendMoneyAmountPage from '../../pages/SendMoneyAmountPage';
import SendMoneyConfirmationPage from '../../pages/SendMoneyConfirmationPage';
import SendMoneySuccessPage from '../../pages/SendMoneySuccessPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');
const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;

const data: [any] = require('../../data/ui-tests/sendMoney/sendMoneyP2P.json');

describe.each(data)(
  'Test: $featureId for Send P2P',
  ({
    featureId,
    country,
    senderCountryCode,
    receiverCountryCode,
    phoneNumber,
    passcode,
    receiver,
    amount,
    senderCurrency,
    receiverCurrency,
    route,
    receiverCountry,
    logout,
    newInstance,
    accountId,
    deleteApp,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      featureId,
      country,
      senderCountryCode,
      receiverCountryCode,
      phoneNumber,
      passcode,
      receiver,
      amount,
      route,
      receiverCountry,
      newInstance,
      senderCurrency,
      receiverCurrency,
      accountId,
      deleteApp,
    );
    const dashboardPage = new DashboardPage();
    const countryCodeBottomSheet = new CountryCodeBottomSheetPage();
    const sendMoneyAmountPage = new SendMoneyAmountPage();
    const sendMoneyConfirmationPage = new SendMoneyConfirmationPage();
    const sendMoneySuccessPage = new SendMoneySuccessPage();
    const loginPage = new LoginPage();
    const phoneNumberPage = new PhoneNumberInputPage();
    let username: string | '';
    let token: string | '';
    let formattedBalance = '';

    beforeAll(async () => {
      await device.launchApp({
        launchArgs: { featureId: featureId, configType: 'mock' },
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

    it('Verify P2P Flow', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(
        country,
        senderCountryCode,
        phoneNumber,
        passcode,
      );

      const isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);

      await attachDeviceScreenShotToReport('dashboard', 'Senders dashboard');
      await dashboardPage.tapSendBtn();
      await addMsg({ message: `Click on the Route: ${route}` });
      await dashboardPage.clickById(`coreText-${route}-mode-name`);
      await countryCodeBottomSheet.selectCountry(receiverCountry);
      await phoneNumberPage.enterNumber(receiver);
      await attachDeviceScreenShotToReport(
        'receiver_phonenumber',
        'Receiver Phonenumber',
      );
      await countryCodeBottomSheet.tapContinueBtn();

      //P2P Amount Page
      await sendMoneyAmountPage.enterAmount(amount);
      await attachDeviceScreenShotToReport(
        'amount',
        'Amount Details Send to Receiver',
      );
      await addMsg({ message: 'Tap on Next button' });
      await sendMoneyAmountPage.clickById('next');

      //P2P Confirmation Screen
      await sendMoneyConfirmationPage.tapNext();
      await sendMoneyConfirmationPage.wait(testIDs.BackHomeBtn, 7000);

      await attachDeviceScreenShotToReport(
        'Send Money',
        'Transaction Acknowledgement Page',
      );

      //'P2P Status Screen
      await sendMoneySuccessPage.waitAndClickById('modal-button-OK', 7000);
      await sendMoneySuccessPage.tapBackHome();
      await dashboardPage.isAccountBalanceVisible();
    }, 360000);

    afterAll(async () => {
      try {
        log.info('*** it afterAll ***');
        if (logout === false) {
          log.info('*** it afterAll logout ***');
          return;
        }

        await dashboardPage.tapProfileBtn();
        const homeMenu = new HomeMenu();
        await homeMenu.logOut();
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
