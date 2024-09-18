import { log } from 'detox';

import LoginPage from '../../pages/LoginPage';
import OTPPage from '../../pages/OTPPage';
import OnBoardingPage from '../../pages/OnBoardingPage';
import PasscodePage from '../../pages/PasscodePage';
import TermsAndConditionsPage from '../../pages/TermsAndConditionsPage';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  printDeviceInformation,
} from '../../utils/helper';

const globalAny: any = global;
// const data: [
//   any,
// ] = require(`../../data/${globalAny?.tester}/onBoarding/profile.json`);
const data: [any] = require('../../data/ui-tests/onboarding/onboarding.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

describe.each(data)(
  'Verify Create Account -',
  ({
    country,
    countryCode,
    passcode,
    featureId,
    phoneNumber,
    otp,
    deleteApp,
  }) => {
    const loginPage = new LoginPage();
    const onBoardingPage = new OnBoardingPage();
    const otpPage = new OTPPage();
    const passcodePage = new PasscodePage();
    const termsAndConditionsPage = new TermsAndConditionsPage();

    beforeAll(async () => {
      const info = await printDeviceInformation(device);
      await addCustomLogToReporter(JSON.stringify(info));
    });

    beforeEach(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
        launchArgs: { featureId: featureId, configType: 'mock' },
        delete: deleteApp,
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

    it(`Verify a user Create Account for ${country} without KYC completion`, async () => {
      try {
        await loginPage.tapCreateAccountButton();
        await onBoardingPage.tapContinueBtn();
        await onBoardingPage.enterNickName();
        await onBoardingPage.tapContinueBtn();
        // await device.disableSynchronization();

        await onBoardingPage.enterPhoneNumber(country, phoneNumber);
        //await new Promise(resolve => setTimeout(resolve, 10000));

        // const phoneNumberWithCode = countryCode + phoneNumber;
        // log.info('phonenumberwithcode', phoneNumberWithCode);
        // const result = await getOTP(phoneNumberWithCode);
        // log.info('result', result);
        await device.disableSynchronization();
        await element(by.id('modal-button-Ok')).tap();
        await new Promise(resolve => setTimeout(resolve, 10000));

        await otpPage.enterOTP(otp);
        await device.enableSynchronization();
        //await new Promise(resolve => setTimeout(resolve, 10000));
        await passcodePage.enterPasscode(passcode);
        //await new Promise(resolve => setTimeout(resolve, 10000));
        await passcodePage.enterPasscode(passcode);

        await termsAndConditionsPage.tapChkboxTC();
        await termsAndConditionsPage.tapNextBtn();

        // await onBoardingPage.tapVerifyAccountBtn();
        // await onBoardingPage.tapVerifyBtn();

        // await sourceOfFundsPage.tapOccupation();
        // await sourceOfFundsPage.selectOccupationOptionFromBottomSheet();
        // await sourceOfFundsPage.tapSector();
        // await sourceOfFundsPage.selectSectorOptionFromBottomSheet();
        // await sourceOfFundsPage.tapSubSector();
        // await sourceOfFundsPage.selectSubSectorOptionFromBottomSheet();
        // await sourceOfFundsPage.tapIncomeRange();
        // await sourceOfFundsPage.selectIncomeRangeOptionFromBottomSheet();
        // await sourceOfFundsPage.tapSelectSof();
        // await sourceOfFundsPage.tapNextBtn();

        //  await device.enableSynchronization();
        // await dashboardPage.tapProfileBtn();
        // await settingsPage.tapVerificationBtn();
        // //await new Promise(resolve => setTimeout(resolve, 10000));

        // await verificationPage.tapConfirmBtn();
        // await new Promise(resolve => setTimeout(resolve, 10000));

        // // await element(by.text('Upload Document')).tap();
        // await new Promise(resolve => setTimeout(resolve, 10000));

        // const filePath = '/Users/nandhinielancheran/pyypl-mobile-app/e2e/data/res/dummy.pdf';
        // // await element(by.text(filePath)).tap();
        // await element(by.text('Upload Document')).typeText(filePath);
        //-------------------------------

        //  await settingsPage.tapSourceOfFundsBtn();

        // if (sofType === 'update') {
        //   let actualSofTitle: any = await sourceOfFundsPage.verifySOFTitle();
        //   await addMsg({
        //     message: `Verify the user navigated to Source Of Funds page:${actualSofTitle === 'Source of funds' ? 'PASS' : 'FAIL'}`,
        //   });
        //   jestExpect(actualSofTitle).toEqual('Source of funds');
        //   await sourceOfFundsPage.tapOccupation();
        //   await sourceOfFundsPage.selectOccupationOptionFromBottomSheet();
        //   await sourceOfFundsPage.tapSector();
        //   await sourceOfFundsPage.selectSectorOptionFromBottomSheet();
        //   await sourceOfFundsPage.tapSubSector();
        //   await sourceOfFundsPage.selectSubSectorOptionFromBottomSheet();
        //   await sourceOfFundsPage.tapIncomeRange();
        //   await sourceOfFundsPage.selectIncomeRangeOptionFromBottomSheet();
        //   await sourceOfFundsPage.tapUpdateBtn();
        // }
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
