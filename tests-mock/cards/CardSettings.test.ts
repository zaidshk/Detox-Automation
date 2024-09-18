//coreText-Card settings
//coreText-headerBar-title
//selectItem-customizeCard
//selectItem-blockCard
//selectItem-NameItem
//selectItem-blockCard
//selectItem-customizeCard
//coreText-CardCustomScreen-title
//coreText-CardCustomScreen-description
//CardNumberTxt
//CardNameTxt
//CardExpiryTxt
//NameInput
//ConfirmBtn
//CardStatusTxt-CardScreen-Text
//CardFreezeBtn
//CardDetailsBtn
//modal-button-Unfreeze
import { expect } from '@jest/globals';
import { log } from 'detox';

import CardPage from '../../pages/CardPage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');

const globalAny: any = global;
const data: [
  any,
] = require('../../data/ui-tests/cardManagement/cardsetting.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');

describe.each(data)(
  '$featureId ($scenarioId) for Card Status',
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
    status,
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
      status,
    );
    const dashboardPage = new DashboardPage();
    const cardPage = new CardPage();

    beforeAll(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
        launchArgs: {
          featureId: featureId,
          configType: 'mock',
        },
        newInstance: true,
        //delete: true,
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
    it('Verify Virtual card status', async () => {
      try {
        // await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

        const loginPage = new LoginPage();
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

        const isDashboardVisible = await dashboardPage.isDashboardVisible();
        expect(isDashboardVisible).toEqual(true);

        await dashboardPage.tapCardsBtn();
        await cardPage.pullDownToRefresh('KeyboardAwareScrollView');

        await cardPage.tapSettingsBtn();
        await attachDeviceScreenShotToReport('Card Settings Page', '');
        const isSettingsVisible = await cardPage.expectToBeVisible(
          'coreText-Card settings',
        );
        expect(isSettingsVisible).toEqual(true);

        let elementsArray = [
          'coreText-headerBar-title',
          'selectItem-customizeCard',
          'selectItem-blockCard',
          'selectItem-NameItem',
        ];

        await cardPage.validateAllElementsExist(elementsArray);

        // await element(by.id('selectItem-customizeCard')).tap();
        await cardPage.tapCustomizeCardBtn();
        await attachDeviceScreenShotToReport('Card Personalisation Page', '');

        elementsArray = [
          'coreText-CardCustomScreen-title',
          'coreText-CardCustomScreen-description',
          'CardNumberTxt',
          'CardNameTxt',
          'CardExpiryTxt',
          'NameInput',
          'ConfirmBtn',
        ];

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
