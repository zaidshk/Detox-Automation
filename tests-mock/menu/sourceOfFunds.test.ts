import { expect } from '@jest/globals';
import { log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import SettingsPage from '../../pages/SettingsPage';
import SourceOfFundsPage from '../../pages/SourceOfFundsPage';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  printDeviceInformation,
} from '../../utils/helper';

// const globalAny: any = global;
// const data: [any] = require(`../../data//settings/sof.json`);
const data: [any] = require('../../data/ui-tests/menu/sourceofFund.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Source Of Funds: $featureId',
  ({
    featureId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    sofType,
    deleteApp,
  }) => {
    const dashboardPage = new DashboardPage();
    const settingsPage = new SettingsPage();
    const loginPage = new LoginPage();
    const sourceOfFundsPage = new SourceOfFundsPage();

    beforeAll(async () => {
      const info = await printDeviceInformation(device);
      await addCustomLogToReporter(JSON.stringify(info));
    });
    beforeEach(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
        delete: deleteApp,
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
    it(`Verify the Source Of Funds page`, async () => {
      try {
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapProfileBtn();
        await settingsPage.tapSourceOfFundsBtn();

        let actualSofTitle: any = await sourceOfFundsPage.verifySOFTitle();
        await addMsg({
          message: `Verify the user navigated to Source Of Funds page:${
            actualSofTitle === 'Source of funds' ? 'PASS' : 'FAIL'
          }`,
        });
        expect(actualSofTitle).toEqual('Source of funds');
        await sourceOfFundsPage.tapOccupation();
        await sourceOfFundsPage.selectOccupationOptionFromBottomSheet();
        await sourceOfFundsPage.tapSector();
        await sourceOfFundsPage.selectSectorOptionFromBottomSheet();
        await sourceOfFundsPage.tapSubSector();
        await sourceOfFundsPage.selectSubSectorOptionFromBottomSheet();
        await sourceOfFundsPage.tapIncomeRange();
        await sourceOfFundsPage.selectIncomeRangeOptionFromBottomSheet();
        await sourceOfFundsPage.tapSelectTurnOver();
        await sourceOfFundsPage.tapSelectSof();
        await attachDeviceScreenShotToReport(
          'Source of Fund',
          'Source of Fund Form Filled',
        );
        await sourceOfFundsPage.tapUpdateBtn();
        await sourceOfFundsPage.tapModalOkayBtn();
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
