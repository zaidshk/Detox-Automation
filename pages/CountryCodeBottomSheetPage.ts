import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export interface ICountryCodeBottomSheetPage {
  selectCountryCode(): void;
  searchCountry(country: string): void;
  enterPhoneNumber(phonenumber: string): void;
  tapContinueBtn(): void;
}

export default class CountryCodeBottomSheetPage
  extends BasePage
  implements ICountryCodeBottomSheetPage
{
  get countryCodeDropDown() {
    return element(by.id(testIDs.CountryCode));
  }

  get phoneNumberInput() {
    return element(by.id(testIDs.PhoneInput));
  }

  get searchBarInput() {
    return element(by.id(testIDs.SearchInput));
  }

  get continueBtn() {
    return element(by.id(testIDs.ContinueBtn));
  }

  async selectCountryCode() {
    return this.countryCodeDropDown.tap();
  }

  async searchCountry(country: string) {
    return this.searchBarInput.typeText(country);
  }

  async enterPhoneNumber(phonenumber: string) {
    return this.phoneNumberInput.typeText(phonenumber);
  }

  async tapContinueBtn() {
    const isContinueVisible: boolean = await this.expectToBeVisibleByElement(
      this.continueBtn,
    );
    await addMsg({
      message: `Tap on Continue button in the Country Bottom sheet: ${
        isContinueVisible ? 'PASS' : 'FAIL'
      }. Is Continue button visible? ${isContinueVisible}`,
    });
    return this.continueBtn.tap();
  }

  async selectCountry(country: string) {
    await this.selectCountryCode();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await this.searchCountry(country);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await element(by.id(testIDs.SearchInput)).tapReturnKey();
    await new Promise(resolve => setTimeout(resolve, 2000));
    const isCountryVisible: boolean = await this.expectToBeVisibleByElement(
      element(by.id(country)),
    );
    await this.clickById(country);
  }
}
