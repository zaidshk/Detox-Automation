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
] = require('../../data/ui-tests/cardManagement/virtualCardStatus.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  '$featureId ($scenarioId) for Card Status',
  ({
    featureId,
    scenarioId,
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
      scenarioId,
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
          scenarioId: scenarioId,
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
        attributes = accountCards;
        // await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

        const loginPage = new LoginPage();
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

        const isDashboardVisible = await dashboardPage.isDashboardVisible();
        expect(isDashboardVisible).toEqual(true);
        await dashboardPage.pullDownToRefresh('KeyboardAwareScrollView');

        await dashboardPage.tapCardsBtn();
        await cardPage.pullDownToRefresh('KeyboardAwareScrollView');

        if (status === 'Blocked') {
          const getAttributes: any = await element(
            by.id(`Card-status-text`),
          ).getAttributes();

          log.info('Card-status-text', getAttributes, status);
          expect(getAttributes?.text).toEqual(status);

          let elementsArray = [
            'CardNumberTxt',
            'CardNameTxt',
            'CardExpiryTxt',
            'CardDetailsBtn',
            'CardReplaceBtn',
            'coreText-card-status',
            'coreText-card-description',
          ];

          await cardPage.validateAllElementsExist(elementsArray);
        } else if (status === 'Frozen') {
          const getAttributes: any = await element(
            by.id(`Card-status-text`),
          ).getAttributes();

          log.info('Card-status-text', getAttributes, status);
          expect(getAttributes?.text).toEqual(status);

          let elementsArray = [
            'CardNumberTxt',
            'CardNameTxt',
            'CardExpiryTxt',
            'CardDetailsBtn',
            'CardFreezeBtn',
            'selectItem-blockCard',
            'coreText-CardBlockedReasonScreen-title',
            'coreText-CardBlockedReasonScreen-description',
          ];

          await cardPage.validateAllElementsExist(elementsArray);
        } else if (status === 'Unavailable') {
          let elementsArray = [
            'ActionCard-card-touchable',
            'ActionCard-title-text',
            'ActionCard-description-text',
          ];

          await cardPage.validateAllElementsExist(elementsArray);

          await element(by.id('ActionCard-card-touchable')).tap();

          elementsArray = [
            'coreText-KYCStateScreen-title',
            'coreText-KYCStateScreen-body',
            'coreText-KYCRequirements-GOVERNMENT_IDENTIFICATION_DOCUMENT-title',
            'coreText-KYCRequirements-GOVERNMENT_IDENTIFICATION_DOCUMENT-description',
            'coreText-KYCRequirements-GOVERNMENT_IDENTIFICATION_DOCUMENT-status',
            'KYCStateScreen-callToAction-verifyAgain',
          ];

          await cardPage.validateAllElementsExist(elementsArray);
        }
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
