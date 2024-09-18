//import { expect as jestExpect } from '@jest/globals';
import { device, log } from 'detox';

//import data from '../data/addMoney/cashLoad.json';
import { LoadLocation } from '../../../models';
import CashLoadPage from '../../pages/CashLoadPage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import TopUpLoadChannelPage from '../../pages/TopUpLoadChannelPage';
import {
  fetchUserAccountDetails,
  listLoadLocations,
} from '../../utils/graphQL';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
} from '../../utils/helper';
import { JestType, jestExpect } from '../../utils/jestExpect';

const { exec } = require('child_process');

const { addAttach, addMsg } = require('jest-html-reporters/helper');

const globalAny: any = global;
const data: [any,] = require(`../../data/${globalAny?.tester}/addMoney/cashLoad.json`);

// In Android - setLocation works only with Real device (Expect the failure in emulator execution)

describe.each(data)(
  'Test CashLoad from $country with phoneNumber:$phoneNumber',
  ({ country, countryCode, phoneNumber, passcode, currency }) => {
    log.info(
      '*** Describe dataSet for ***',
      country,
      countryCode,
      phoneNumber,
      passcode,
      currency,
    );
    const dashboardPage = new DashboardPage();
    let loadLocations: LoadLocation[] | null = null;
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
      log.info(
        '*****  beforeAll CUSTOM LAUNCH ARGS *******',
        device.appLaunchArgs.get(),
      );
      log.info(
        '***** beforeAll CUSTOM LAUNCH SHARED ARGS *******',
        device.appLaunchArgs.shared.get(),
      );

      await device.launchApp({
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

      const details = await fetchUserAccountDetails(
        countryCode,
        phoneNumber,
        passcode,
      );
      log.info('** details **\n', details);

      loadLocations = await listLoadLocations(details?.token);

      await addCustomLogToReporter(JSON.stringify(details));
    });

    it('Verify Login Feature', async () => {
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
    });

    it('Verify Load Method', async () => {
      await dashboardPage.tapTopUpBtn();
      const topUpLoadChannelPage = new TopUpLoadChannelPage();
      await topUpLoadChannelPage.tapOnCashLoad();

      const cashLoadPage = new CashLoadPage();
      await setLocation();

      if (
        (await cashLoadPage.expectToExist('coreText-title')) ||
        (await cashLoadPage.expectToBeVisible('coreText-title'))
      ) {
        await device.disableSynchronization();
        await cashLoadPage.tapNextBtn();
      }
      await new Promise(resolve => setTimeout(resolve, 10000));

      // await new Promise(resolve => setTimeout(resolve, 10000));
      // if (
      //   (await cashLoadPage.expectToExist('BackButton')) ||
      //   (await cashLoadPage.expectToBeVisible('BackButton'))
      // ) {
      //   await element(by.id('BackButton')).tap();
      //   await device.enableSynchronization();
      //   await cashLoadPage.tapNextBtn();
      // }

      const isMapVisible =
        (await cashLoadPage.expectToExist('mapView')) ||
        (await cashLoadPage.expectToBeVisible('mapView'));
      log.info('isMapVisible ****', isMapVisible);
      //jestExpect(isMapVisible).toEqual(true);
      jestExpect(
        `Is Map Visible -${isMapVisible}`,
        isMapVisible,
        true,
        JestType.equals,
      );

      //Gradle version reverse
      const filteredLoad = loadLocations?.filter(load => {
        return load?.loadLocationId === '1029';
      });
      log.info('Tapped Location **', filteredLoad);

      await element(by.id('1029')).tap(); //Change this and make it dynamic
      await new Promise(resolve => setTimeout(resolve, 10000));

      const isDetailPageMapVisible =
        (await cashLoadPage.expectToExist('mapView')) ||
        (await cashLoadPage.expectToBeVisible('mapView'));
      log.info('isDetailPageMapVisible ****', isDetailPageMapVisible);
      //jestExpect(isDetailPageMapVisible).toEqual(true);
      jestExpect(
        `Is Map Visible on Detail Page -${isDetailPageMapVisible}`,
        isDetailPageMapVisible,
        true,
        JestType.equals,
      );

      const loadProviderText =
        await cashLoadPage.getLoadProviderForDetailPage();

      jestExpect(
        `LoadProviderText on Detail Page -${loadProviderText}`,
        loadProviderText,
        filteredLoad![0].loadProvider,
        JestType.equals,
      );

      const addressText = await cashLoadPage.getAddressForDetailPage();

      jestExpect(
        `Address on Detail Page -${addressText}`,
        addressText,
        filteredLoad![0].loadLocationAddress?.addressLine1,
        JestType.equals,
      );
    });

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
