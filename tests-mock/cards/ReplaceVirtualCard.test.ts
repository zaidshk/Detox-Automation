//selectItem-blockCard
//selectItem-customizeCard
////modal-title
//modal-subtitle
//modal-button-Cancel
//modal-button-Confirm
//reason-STOLEN
//reason-BROKEN
//reason-LOST
//reason-COMPROMISED
//coreText-CardBlockedReasonScreen-title
//coreText-CardBlockedReasonScreen-description
//reason-STOLEN-Touchable
//modal-title
//modal-subtitle
//modal-button-Cancel
//modal-button-Confirm
//coreText-card-status
//coreText-card-description
//CardStatusTxt-CardScreen-Text
//coreText-CardCustomScreen-title
//coreText-CardCustomScreen-description
import { expect } from '@jest/globals';
import { log } from 'detox';

import CardCustomisePage from '../../pages/CardCustomisePage';
import CardPage from '../../pages/CardPage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');

const globalAny: any = global;
const data: [
  any,
] = require('../../data/ui-tests/cardManagement/replaceVirtualCard.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Test: $featureId for New Card Service',
  ({
    featureId,
    country,
    countryCode,
    passcode,
    phoneNumber,
    newInstance,
    logout,
    userType,
    accountCards,
    userId,
    accountId,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      featureId,
      country,
      countryCode,
      passcode,
      phoneNumber,
      newInstance,
      logout,
      userType,
      accountCards,
    );
    const dashboardPage = new DashboardPage();
    const cardPage = new CardPage();
    const cardCustomisePage = new CardCustomisePage();

    beforeAll(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
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
    it('Verify Get New Virtual card service', async () => {
      try {
        attributes = accountCards;
        // await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

        const loginPage = new LoginPage();
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

        let isDashboardVisible = await dashboardPage.isDashboardVisible();
        expect(isDashboardVisible).toEqual(true);

        await dashboardPage.tapCardsBtn();
        await cardPage.pullDownToRefresh('KeyboardAwareScrollView');

        await cardPage.tapReplaceBtn();
        let elementsArray = [
          'modal-title',
          'modal-subtitle',
          'modal-button-Replace',
        ];

        await cardPage.validateAllElementsExist(elementsArray);

        await cardPage.tapModalReplaceBtn();

        elementsArray = ['CardNameTxt', 'CardNumberTxt', 'CardExpiryTxt'];

        await cardPage.validateAllElementsExist(elementsArray);

        await cardCustomisePage.tapConfirmBtn();

        await new Promise(resolve => setTimeout(resolve, 5000));

        await cardPage.validateAllElementsExist(elementsArray);
      } catch (error) {
        log.info(`
             You did something wrong dummy!
             ${error}
           `);
        throw error;
      }
    }, 300000);
    afterEach(async () => {
      await attachDeviceScreenShotToReport('Test Finished', '');
    });

    afterAll(async () => {
      log.info('*** Final afterAll ***');
    });
  },
);