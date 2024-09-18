import { expect } from '@jest/globals';
import { log } from 'detox';

import { AccountCardSet } from '../../../src/types/commons';
import CardBottomSheetPage from '../../pages/CardBottomSheetPage';
import CardCheckoutPage from '../../pages/CardCheckoutPage';
import CardCustomisePage from '../../pages/CardCustomisePage';
import CardPage from '../../pages/CardPage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');

const globalAny: any = global;
const data: [
  any,
] = require('../../data/ui-tests/cardManagement/requestVirtualCard.json');

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
    const cardBottomSheetPage = new CardBottomSheetPage();
    const cardCustomisePage = new CardCustomisePage();
    const loginPage = new LoginPage();
    const cardCheckoutPage = new CardCheckoutPage();
    const cards: AccountCardSet[] | null = null;

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

        const isDashboardVisible = await dashboardPage.isDashboardVisible();
        expect(isDashboardVisible).toEqual(true);

        await dashboardPage.tapCardsBtn();
        await cardPage.pullDownToRefresh('KeyboardAwareScrollView');

        await cardPage.verifyAddVirtualCard(attributes);
        await cardBottomSheetPage.tapRequestVirtualCard();
        const isFeeAlertModalShown = await cardPage.tapModalConfirmBtn();
        await cardCustomisePage.tapConfirmBtn();
        await cardCheckoutPage.tapConfirmBtn();
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
