import { log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import PasscodePage from '../../pages/PasscodePage';
import ProfilePage from '../../pages/ProfilePage';
import SettingsPage from '../../pages/SettingsPage';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  printDeviceInformation,
} from '../../utils/helper';
import { JestType, jestExpect } from '../../utils/jestExpect';

const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/settings/profile.json`);

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Verify Settings - Profile Options -',
  ({ country, countryCode, phoneNumber, passcode, sofType }) => {
    const dashboardPage = new DashboardPage();
    const settingsPage = new SettingsPage();
    const loginPage = new LoginPage();
    const profilePage = new ProfilePage();
    const passcodePage = new PasscodePage();

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
    it(`Verify the Profile details for ${country} user using ${countryCode}${phoneNumber}`, async () => {
      try {
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapProfileBtn();
        await settingsPage.tapProfileBtn();
        let isVisible = await profilePage.verifyName();
        jestExpect(
          `Verify Name on Profile Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
        isVisible = await profilePage.verifyPhoneNumber();
        jestExpect(
          `Verify PhoneNumber on Profile Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
        isVisible = await profilePage.verifyNickName();
        jestExpect(
          `Verify NickName on Profile Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
        isVisible = await profilePage.verifyLanguage();
        jestExpect(
          `Verify Language on Profile Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
        isVisible = await profilePage.verifyBirthDate();
        jestExpect(
          `Verify BirthDate on Profile Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
        isVisible = await profilePage.verifyEmail();
        jestExpect(
          `Verify Email on Profile Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
        await new Promise(resolve => setTimeout(resolve, 15000));
        isVisible = await profilePage.verifyAddress();
        jestExpect(
          `Verify Address on Profile Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
      } catch (error) {
        log.info(`
             You did something wrong dummy!
             ${error}
           `);
        throw error;
      }
    });

    it(`Verify the Change Passcode functionality for ${country} user using ${countryCode}${phoneNumber}`, async () => {
      try {
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapProfileBtn();
        await settingsPage.tapProfileBtn();
        await profilePage.tapChangePasscode();
        let title = await passcodePage.verifyTitle();
        jestExpect(
          `Verify user navigated to Old passcode page - ${title}`,
          title,
          'Old passcode',
          JestType.equals,
        );
        await addMsg({ message: `Old passcode:${passcode}` });
        await passcodePage.enterPasscode(passcode);

        title = await passcodePage.verifyTitle();
        jestExpect(
          `Verify user navigated to New passcode page - ${title}`,
          title,
          'New passcode',
          JestType.equals,
        );
        await addMsg({ message: `New passcode:9999` });
        await passcodePage.enterPasscode('9999');
        title = await passcodePage.verifyTitle();
        jestExpect(
          `Verify user navigated to Confirm passcode page - ${title}`,
          title,
          'Confirm passcode',
          JestType.equals,
        );
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
