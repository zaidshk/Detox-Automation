import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

export default class OTPPage extends BasePage {
  get otpLogo() {
    return element(by.id(testIDs.OTPLogo));
  }

  async fetchOtp(countryCode: string, phoneNumber: string) {
    log.info(
      'otp link',
      `https://api.dev.pyypl.io/users/otp/${countryCode}${phoneNumber}`,
    );
    const res = await fetch(
      `https://api.dev.pyypl.io/users/otp/${countryCode}${phoneNumber}`,
    );
    const result = await res.json();
    log.info('auto otp', result);
    return result;
  }

  async enterOTP(otp: string) {
    log.info('enterOTP', otp);
    return element(by.id(testIDs.OTPInput)).typeText(otp);
  }

  isOtpLogoVisible() {
    return (
      this.expectToExist(testIDs.OTPLogo) ||
      this.expectToBeFocused(testIDs.OTPLogo) ||
      this.expectToBeVisibleByElement(this.otpLogo)
    );
  }
}
