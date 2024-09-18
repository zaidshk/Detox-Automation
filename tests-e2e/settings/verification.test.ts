import { log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import SettingsPage from '../../pages/SettingsPage';
import VerificationPage from '../../pages/VerificationPage';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  printDeviceInformation,
} from '../../utils/helper';
import { JestType, jestExpect } from '../../utils/jestExpect';

const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/settings/verification.json`);

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Verify Settings Options -',
  ({ country, countryCode, phoneNumber, passcode, verificationType }) => {
    const dashboardPage = new DashboardPage();
    const settingsPage = new SettingsPage();
    const loginPage = new LoginPage();
    const verificationPage = new VerificationPage();

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
    it('Verify Document verification for KYC completed user', async () => {
      try {
        await loginPage.loginFlow(
          country,
          countryCode,
          phoneNumber,
          passcode,
          verificationType,
        );
        await dashboardPage.tapProfileBtn();
        let isVisible = await settingsPage.tapVerificationBtn();
        jestExpect(
          `Verify and Tap on Verification button on settings Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
        if (data[0].verificationType === 'completed') {
          isVisible = await verificationPage.verifyDocTitle();
          jestExpect(
            `Verify Document title on Verification Page -${isVisible}`,
            isVisible,
            true,
            JestType.equals,
          );
          const isStatusVisible = await verificationPage.verifyStatus();
          jestExpect(
            `Verify Status label on Verification Page -${isStatusVisible.isStatusLabel}`,
            isStatusVisible.isStatusLabel,
            true,
            JestType.equals,
          );
          jestExpect(
            `Verify Status text on Verification Page -${isStatusVisible.isStatusText}`,
            isStatusVisible.isStatusText,
            true,
            JestType.equals,
          );
          isVisible = await verificationPage.verifyFirstName();
          jestExpect(
            `Verify First name on Verification Page -${isVisible}`,
            isVisible,
            true,
            JestType.equals,
          );
          isVisible = await verificationPage.verifyLastName();
          jestExpect(
            `Verify Last name on Verification Page -${isVisible}`,
            isVisible,
            true,
            JestType.equals,
          );
          isVisible = await verificationPage.verifyNationality();
          jestExpect(
            `Verify Nationality on Verification Page -${isVisible}`,
            isVisible,
            true,
            JestType.equals,
          );
          isVisible = await verificationPage.verifyBirthDate();
          jestExpect(
            `Verify birth date on Verification Page -${isVisible}`,
            isVisible,
            true,
            JestType.equals,
          );
        }
      } catch (error) {
        log.info(`
             You did something wrong dummy!
             ${error}
           `);
        throw error;
      }
    });

    it('Verify Document verification for KYC Not Completed user', async () => {
      try {
        await loginPage.loginFlow(
          country,
          countryCode,
          phoneNumber,
          passcode,
          verificationType,
        );
        await dashboardPage.tapProfileBtn();
        let isVisible = await settingsPage.tapVerificationBtn();
        jestExpect(
          `Verify and Tap on Verification button on settings Page -${isVisible}`,
          isVisible,
          true,
          JestType.equals,
        );
        if (verificationType === 'Notcompleted') {
          const isMissingDocsVisible =
            await verificationPage.verifyMissingDocs();
          jestExpect(
            `Verify Missing Goverment Document on Verification Page -${isMissingDocsVisible.isMissingGovDoc}`,
            isMissingDocsVisible.isMissingGovDoc,
            true,
            JestType.equals,
          );
          jestExpect(
            `Verify Missing Selfie on Verification Page -${isMissingDocsVisible.isMissingSelfie}`,
            isMissingDocsVisible.isMissingSelfie,
            true,
            JestType.equals,
          );
          isVisible = await verificationPage.tapConfirmBtn();
          jestExpect(
            `Verify Confirm button on Verification Page -${isVisible}`,
            isVisible,
            true,
            JestType.equals,
          );
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
