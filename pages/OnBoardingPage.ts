import { testIDs } from '../../src/testIds/testId';
import CountryCodeBottomSheetPage from '../pages/CountryCodeBottomSheetPage';
import PhoneNumberInputPage from '../pages/PhoneNumberInputPage';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class OnBoardingPage extends BasePage {
  get continueBtn() {
    return element(by.text('Continue'));
  }
  get nickName() {
    return element(by.id(testIDs.NickName));
  }
  get phoneInput() {
    return element(by.id(testIDs.PhoneInput));
  }
  get verifyAccount() {
    return element(by.text('Verify account'));
  }
  get verifyBtn() {
    return element(by.text('Verify'));
  }
  async tapVerifyBtn() {
    await this.expectToBeVisibleByElement(this.verifyBtn);
    await this.verifyBtn.tap();
  }
  async tapVerifyAccountBtn() {
    await this.expectToBeVisibleByElement(this.verifyAccount);
    await this.verifyAccount.tap();
  }
  async tapContinueBtn() {
    await this.expectToBeVisibleByElement(this.continueBtn);
    await this.continueBtn.tap();
  }
  async enterNickName() {
    await this.nickName.typeText('Automation Test');
  }
  async enterPhoneNumber(country: string, phoneNumber: string) {
    const countryCodeBottomSheet = new CountryCodeBottomSheetPage();
    await countryCodeBottomSheet.selectCountry(country);
    const phoneNumberPage = new PhoneNumberInputPage();
    await phoneNumberPage.enterNumber(phoneNumber);
    await phoneNumberPage.tapNext();
    return phoneNumber;
  }
}
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomUAEPhoneNumber(): string {
  const uaeAreaCodes = ['50', '51', '52', '55', '56'];
  const selectedAreaCode =
    uaeAreaCodes[getRandomNumber(0, uaeAreaCodes.length - 1)];
  const remainingDigits = getRandomNumber(1000000, 9999999)
    .toString()
    .substring(0, 7);
  return `${selectedAreaCode}${remainingDigits}`;
}

