//var BasePage = require ('./BasePage.js');
import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import { getOTP } from '../utils/graphQL';
import { attachDeviceScreenShotToReport } from '../utils/helper';
import BasePage from './BasePage';
import CountryCodeBottomSheetPage from './CountryCodeBottomSheetPage';
import OTPPage from './OTPPage';
import PasscodePage from './PasscodePage';
import PhoneNumberInputPage from './PhoneNumberInputPage';

const globalAny: any = global;
const { addAttach, addMsg } = require('jest-html-reporters/helper');

export interface ILoginPage {
  tapLoginButton(): void;
}

export default class LoginPage extends BasePage implements ILoginPage {
  get loginButton() {
    return element(by.id(testIDs.LoginBtn));
  }
  get notNowButton() {
    return element(by.id('NotNowBtn-UpdateScreen-button'));
  }
  get phoneInput() {
    return element(by.id(testIDs.PhoneInput));
  }
  get createAccount() {
    return element(by.id(testIDs.CreateAccountBtn));
  }

  isLoginVisible() {
    return this.expectToBeVisibleByElement(this.loginButton);
  }
  isPhoneInputVisible() {
    return this.expectToBeVisibleByElement(this.phoneInput);
  }
  async tapLoginButton() {
    return this.loginButton.tap();
  }
  async tapCreateAccountButton() {
    return this.createAccount.tap();
  }

  async tapNotNowButton() {
    return this.notNowButton.tap();
  }

  async loginFlow(
    country: string,
    countryCode: string,
    phoneNumber: string,
    passcode: string,
    testType = 'test',
  ) {
    /*
    log.info('app type ****', globalAny?.device?._currentApp?.binaryPath);
    const isDebugBuild = globalAny.device._currentApp.binaryPath.includes(
      'Debug-' || '-debug',
    );
    console.log(`Detox build type: ${isDebugBuild ? 'debug' : 'release'}`);
    isDebugBuild
      ? await new Promise(resolve => setTimeout(resolve, 30000))
      : null;
    */

    log.info('should login ****', country, phoneNumber, passcode);
    const isLoginPage = await this.expectToBeVisible(testIDs.LoginBtn);
    await attachDeviceScreenShotToReport(
      `${testType}-${phoneNumber}-LoginScreen`,
      'Login Screen at App Launch',
    );

    await addMsg({ message: `isLoginPage:${isLoginPage}` });
    const passcodePage = new PasscodePage();
    const countryCodeBottomSheet = new CountryCodeBottomSheetPage();

    if (isLoginPage) {
      const isUpdatePage = await this.expectToBeVisible(
        'NotNowBtn-UpdateScreen-button',
      );
      isUpdatePage ? await this.tapNotNowButton() : null;

      await this.tapLoginButton();
      const isPhoneNumberPage = await this.expectToBeVisible(
        testIDs.PhoneInput,
      );
      log.info('isPhoneNumberPage', isPhoneNumberPage);
      await countryCodeBottomSheet.selectCountry(country);
      await device.disableSynchronization();
      const phoneNumberPage = new PhoneNumberInputPage();
      await phoneNumberPage.enterNumber(phoneNumber);
      log.info('Phone number entered');
      await attachDeviceScreenShotToReport(
        `${testType}-${phoneNumber}-EnterNumber`,
        'User PhoneNumber',
      );
      await phoneNumberPage.tapNext();
      await new Promise(resolve => setTimeout(resolve, 30000));
      const otpPage = new OTPPage();
      const isOTPPageVisible =
        (await otpPage.expectToExist(`coreText-${testIDs.OTPTitle}`)) ||
        (await otpPage.expectToBeFocused(`coreText-${testIDs.OTPTitle}`)) ||
        (await otpPage.expectToBeVisible(`coreText-${testIDs.OTPTitle}`));
      log.info('isOTPPageVisible', isOTPPageVisible);
      if (isOTPPageVisible) {
        const phoneNumberWithCode = countryCode + phoneNumber;
        log.info('phoneNumberWithCode', phoneNumberWithCode);
        const result = await getOTP(phoneNumberWithCode);
        log.info('OTP', result);
        await otpPage.enterOTP(result);
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
      await passcodePage.enterPasscode(passcode);
      await device.enableSynchronization();
      log.info('Login Successfull');
    } else {
      await addMsg({ message: `passcode:${passcode}` });
      await passcodePage.enterPasscode(passcode);
    }
  }
}
