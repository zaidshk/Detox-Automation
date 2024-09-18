import { expect as jestExpect } from '@jest/globals';
import { log } from 'detox';

import CardBottomSheetPage from '../../pages/CardBottomSheetPage';
import CardCustomisePage from '../../pages/CardCustomisePage';
import CardPage from '../../pages/CardPage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import TopUpLoadChannelPage from '../../pages/TopUpLoadChannelPage';
import {
  getAccount,
  getAccountCards,
  getListServiceFeature,
  getToken,
  getUsername,
} from '../../utils/graphQL';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  getDefaultAccount,
  printDeviceInformation,
} from '../../utils/helper';

const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/cardManagement/card.json`);

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Get New Card Feature',
  ({
    country,
    countryCode,
    passcode,
    phoneNumber,
    newInstance,
    logout,
    userType,
    desiredFeatureNames,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      country,
      countryCode,
      passcode,
      phoneNumber,
      newInstance,
      logout,
      userType,
      desiredFeatureNames,
    );
    const dashboardPage = new DashboardPage();
    const cardPage = new CardPage();
    const cardBottomSheetPage = new CardBottomSheetPage();
    const cardCustomisePage = new CardCustomisePage();
    const loginPage = new LoginPage();
    const topUpLoadChannelPage = new TopUpLoadChannelPage();

    beforeAll(async () => {
      const info = await printDeviceInformation(device);
      await addCustomLogToReporter(JSON.stringify(info));
    });
    beforeEach(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
        delete: true,
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
    it(`Verify Virtual card service for new user of ${country} and phone number: '${countryCode}${phoneNumber}' with userType as '${userType}') `, async () => {
      try {
        const userId = await getUsername(`${countryCode}${phoneNumber}`);
        log.info('username', userId);
        const token = await getToken(
          userId,
          `${countryCode}${phoneNumber}`,
          passcode,
        );
        const accounts = await getAccount(userId, token);
        const defaultAccount = await getDefaultAccount(accounts);
        attributes = await getAccountCards(token, defaultAccount);
        serviceData = await getListServiceFeature(
          token,
          defaultAccount,
          userId,
        );
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapCardsBtn();
        await cardPage.verifyAddVirtualCard(attributes);
        if (userType === 'newUserWithBalance') {
          await cardBottomSheetPage.verifyCardService(
            serviceData,
            desiredFeatureNames,
          );
          await cardBottomSheetPage.tapRequestVirtualCard();
          const cardDetails = await cardCustomisePage.verifyCardName();
          jestExpect(cardDetails.actualName).toEqual(cardDetails.expectedName);
          await addMsg({
            message: `Verify Name on virtual card:${cardDetails.actualName === cardDetails.expectedName
              ? 'PASS'
              : 'FAIL'
              }. Expected Card Name: ${cardDetails.expectedName
              }. Actual Card Name on app UI: ${cardDetails.actualName}`,
          });
          await cardCustomisePage.tapCloseBtn();
        } else if (userType === 'newUserWithoutBalance') {
          const emptyWalletDetails = await cardPage.verifyEmptyWalletModal();
          jestExpect(emptyWalletDetails.isEmptyWalletTitleVisible).toEqual(
            true,
          );
          jestExpect(emptyWalletDetails.actualName).toEqual('Empty wallet');
          await addMsg({
            message: `Verify Empty Wallet Modal:${emptyWalletDetails.actualName === 'Empty wallet' ? 'PASS' : 'FAIL'
              }. Expected Modal Title: Empty wallet. Actual Modal Title: ${emptyWalletDetails.actualName
              }`,
          });
          await cardPage.tapCancelBtn();
          await cardPage.tapNewCardBtn();
          await cardPage.tapTopUpBtn();
          const actualModalTitle =
            await topUpLoadChannelPage.verifyTopUpTitle();
          await addMsg({
            message: `Verify User navigated to Top Up Page from Empty Wallet Model: ${actualModalTitle === 'Top-up' ? 'PASS' : 'FAIL'
              }`,
          });
          await topUpLoadChannelPage.navigateBack();
        }
      } catch (error) {
        log.info(`
             You did something wrong dummy!
             ${error}
           `);
        throw error;
      }
    });

    afterEach(async () => {
      await attachDeviceScreenShotToReport('Screenshot', 'Test End');
    });

    afterAll(async () => {
      log.info('*** Final afterAll ***');
      device.terminateApp();
    });
  },
);
