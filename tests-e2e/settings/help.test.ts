import { log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import HelpPage from '../../pages/HelpPage';
import LoginPage from '../../pages/LoginPage';
import SettingsPage from '../../pages/SettingsPage';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  printDeviceInformation,
} from '../../utils/helper';

const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/settings/profile.json`);

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Verify Settings - Help Options -',
  ({ country, countryCode, phoneNumber, passcode, sofType }) => {
    const dashboardPage = new DashboardPage();
    const settingsPage = new SettingsPage();
    const loginPage = new LoginPage();
    const helpPage = new HelpPage();

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
    it(`Verify the user navigated to Help page`, async () => {
      try {
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapProfileBtn();
        await settingsPage.tapHelpBtn();
        await helpPage.verifyHelpTitle();
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
