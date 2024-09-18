import { expect } from '@jest/globals';
import { device, log } from 'detox';

//import data from '../data/addMoney/cashLoad.json';
//import { LoadLocation } from '../../../models';
import loadLocations from '../../../mockServer/json/ADDMONEY_CASHLOAD/listLoadLocations.json';
import CashLoadPage from '../../pages/CashLoadPage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import TopUpLoadChannelPage from '../../pages/TopUpLoadChannelPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

const { exec } = require('child_process');

const { addAttach, addMsg } = require('jest-html-reporters/helper');

const globalAny: any = global;
const data: [any] = require('../../data/ui-tests/addMoney/cashLoad.json');

// In Android - setLocation works only with Real device (Expect the failure in emulator execution)

describe.each(data)(
  '$featureId ($scenarioId)',
  ({
    country,
    countryCode,
    phoneNumber,
    passcode,
    currency,
    featureId,
    scenarioId,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      country,
      countryCode,
      phoneNumber,
      passcode,
      currency,
      featureId,
    );

    const dashboardPage = new DashboardPage();
    //let loadLocations: LoadLocation[] | null = null;
    const setLocation = async () => {
      log.info('setLocation **');
      if (device.getPlatform() === 'ios') {
        exec(
          "idb list-targets | grep -n 'Booted'",
          (err: any, stdout: any, stderr: any) => {
            log.info('idb list-targets - ', err, stdout, stderr);
            log.info(
              'Execute Command to set Location for iOS **',
              'idb set-location --udid ' + device.id + ' 25.2769 55.2962',
            );
            exec(
              'idb set-location --udid ' + device.id + ' 25.2769 55.2962',
              (err: any, stdout: any, stderr: any) => {
                log.info('setLocation - ', err, stdout, stderr);
              },
            );
          },
        );
      } else {
        await device.setLocation(25.2769, 55.2962);
      }
    };
    beforeAll(async () => {
      await device.launchApp({
        launchArgs: { featureId: featureId, configType: 'mock' },
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
      await setLocation();
    });

    it('Verify Cash Load Flow', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

      const isDashboardVisible = await dashboardPage.isDashboardVisible();
      expect(isDashboardVisible).toEqual(true);

      await dashboardPage.tapTopUpBtn();
      const topUpLoadChannelPage = new TopUpLoadChannelPage();
      await topUpLoadChannelPage.tapOnCashLoad();

      const cashLoadPage = new CashLoadPage();
      await setLocation();

      if (
        (await cashLoadPage.expectToExist('coreText-Top-up')) ||
        (await cashLoadPage.expectToBeVisible('coreText-Top-up'))
      ) {
        await device.disableSynchronization();
        await cashLoadPage.tapNextBtn();
      }
      await new Promise(resolve => setTimeout(resolve, 10000));

      await device.enableSynchronization();
      const isMapVisible =
        (await cashLoadPage.expectToExist('mapView')) ||
        (await cashLoadPage.expectToBeVisible('mapView'));
      log.info('isMapVisible ****', isMapVisible);
      expect(isMapVisible).toEqual(true);

      let elementsArray = [
        'coreText-banner-attentionBanner-description',
        'coreText-banner-attentionBanner-title',
        'coreText-name',
        'coreText-address',
      ];

      const filteredLoad = loadLocations?.filter(load => {
        return load?.loadLocationId === '1029';
      });
      log.info('Tapped Location **', filteredLoad);
      let detailButtonElements = ['Scan QR', 'Directions'];
      let detailPageElementsArray = [
        'coreText-addressLine1',
        'coreText-city',
        'coreText-loadProvider',
      ];

      if (scenarioId === 'Dealer') {
        await element(by.id('coreText-Retail')).tap();
        await element(by.id('1032')).tap();

        detailPageElementsArray = [
          'coreText-addressLine1',
          'coreText-city',
          'coreText-loadProvider',
          'coreText-banner-attentionBanner-description',
          'coreText-banner-attentionBanner-title',
        ];

        detailButtonElements = ['Directions'];
      } else {
        await cashLoadPage.validateAllElementsVisible(elementsArray);

        elementsArray = [
          'coreText-All',
          'coreText-Retail',
          'coreText-Kiosk',
          'coreText-Dealer',
        ];
        await cashLoadPage.validateAllElementsVisibleInList(
          elementsArray,
          true,
          'LoadLocationTypeList',
          'left',
          20,
          'swipe',
        );

        await element(by.id('1029')).tap(); //Change this and make it dynamic
      }

      const isDetailPageMapVisible =
        (await cashLoadPage.expectToExist('mapView')) ||
        (await cashLoadPage.expectToBeVisible('mapView'));
      log.info('isDetailPageMapVisible ****', isDetailPageMapVisible);

      await addMsg({
        message: `Is Map Visible on Detail Page -${isDetailPageMapVisible}`,
      });
      expect(isDetailPageMapVisible).toEqual(true);

      await cashLoadPage.validateAllElementsVisible(detailPageElementsArray);

      if (scenarioId === 'Dealer') {
        await cashLoadPage.validateAllElementsVisible(detailButtonElements);
      }

      const loadProviderText =
        await cashLoadPage.getLoadProviderForDetailPage();

      await addMsg({
        message: `LoadProviderText on Detail Page -${loadProviderText}`,
      });
      expect(loadProviderText).not.toBeNull();

      const addressText = await cashLoadPage.getAddressForDetailPage();

      await addMsg({
        message: `Address on Detail Page -${addressText}`,
      });
      expect(addressText).not.toBeNull();
    }, 300000);

    afterEach(async () => {
      log.info('*** it afterEach ***');
      await attachDeviceScreenShotToReport('Screenshot', 'Test end screenshot');
    });

    afterAll(async () => {
      try {
        log.info('*** it afterAll ***');
      } catch (error) {
        log.error(`
          Script Failed wrong!
         ${error}
        `);
        throw error;
      }
    });
  },
);
