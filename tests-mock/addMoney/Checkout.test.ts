import { expect } from '@jest/globals';
import { log } from 'detox';

//import data from '../data/addMoney/checkout.json';
import CheckoutAmountPage from '../../pages/CheckoutAmountPage';
import CountryCodeBottomSheetPage from '../../pages/CountryCodeBottomSheetPage';
import DashboardPage from '../../pages/DashboardPage';
import HomeMenu from '../../pages/HomeMenu';
import LoginPage from '../../pages/LoginPage';
import TopUpLoadChannelPage from '../../pages/TopUpLoadChannelPage';
import {
  addCustomLogToReporter,
  printDeviceInformation,
} from '../../utils/helper';

const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;
const data: [any] = require(`../../data/ui-tests/addMoney/checkout.json`);

describe.each(data)(
  'Test $loadMoneyType  for amount $amount $currency',
  ({
    featureId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    amount,
    currency,
    loadMoneyType,
    logout,
    newInstance,
    cardNumber,
    cardExpiry,
    cardCVV,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      featureId,
      country,
      countryCode,
      phoneNumber,
      passcode,
      amount,
      currency,
      loadMoneyType,
      logout,
      newInstance,
    );

    const dashboardPage = new DashboardPage();
    const countryCodeBottomSheet = new CountryCodeBottomSheetPage();
    const loginPage = new LoginPage();
    const checkoutAmountPage = new CheckoutAmountPage();

    beforeAll(async () => {
      await device.launchApp({
        launchArgs: { featureId: featureId, configType: 'mock' },
        permissions: {
          location: 'always',
          notifications: 'YES',
          camera: 'YES',
          microphone: 'YES',
          contacts: 'YES',
          userTracking: 'YES',
        },
      });

      const info = await printDeviceInformation(device);
      await addCustomLogToReporter(JSON.stringify(info));
    });

    it('should load money with checkout', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

      const isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);

      let isTopUpBtnVisible: boolean = await dashboardPage.tapTopUpBtn();
      await addMsg({
        message: `Check visiblity of Top Up Button and Click on it: ${
          isTopUpBtnVisible ? 'PASS' : 'FAIL'
        }. Expected: Is Top Up button visible? ${isTopUpBtnVisible}`,
      });

      const topUpLoadChannelPage = new TopUpLoadChannelPage();
      const isdebitCardBtnVisible =
        await topUpLoadChannelPage.tapDebitCardChannel();
      await addMsg({
        message: `Tap on Debit Card: ${
          isdebitCardBtnVisible ? 'PASS' : 'FAIL'
        }. Expected: Is Debit Card option visible? ${isdebitCardBtnVisible}`,
      });

      await topUpLoadChannelPage.clickById(loadMoneyType);
      await checkoutAmountPage.enterAmount(amount);
      await checkoutAmountPage.enterCardDetails(
        cardNumber,
        cardExpiry,
        cardCVV,
      );
      isTopUpBtnVisible = await checkoutAmountPage.isTopUpBtnVisible();
      await addMsg({
        message: `Check visiblity of Top Up Button: ${
          isTopUpBtnVisible ? 'PASS' : 'FAIL'
        }. Expected: Is Top Up button visible? ${isTopUpBtnVisible}`,
      });
    }, 300000);

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
