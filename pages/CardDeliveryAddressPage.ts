import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class CardDeliveryAddressPage extends BasePage {
  get address1() {
    return element(by.id(testIDs.addressLine1));
  }
  get address2() {
    return element(by.id(testIDs.addressLine2));
  }
  get area() {
    return element(by.id(testIDs.area));
  }
  get city() {
    return element(by.id(testIDs.city));
  }
  get country() {
    return element(by.id(testIDs.country));
  }
  get phoneNumber() {
    return element(by.id(testIDs.phoneNumber));
  }
  get nextBtn() {
    return element(by.id(testIDs.NextBtn));
  }

  async enterAddress1(address1: string) {
    return this.address1.typeText(address1);
  }
  async enterAddress2(address2: string) {
    return this.address2.typeText(address2);
  }
  async enterArea(area: string) {
    return this.area.typeText(area);
  }

  async selectCity(city: string) {
    await this.city.tap();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.expectToBeVisibleByElement(element(by.id(city)));
    await this.clickById(city);
  }

  async tapNextBtn() {
    await this.expectToBeVisibleByElement(this.nextBtn);
    await this.nextBtn.tap();
  }

  async verifyCountry() {
    await this.expectToBeVisibleByElement(this.country);
    const getTitleAtt: any = await this.country.getAttributes();
    const actualName = getTitleAtt.text;
    return actualName;
  }

  async verifyPhoneNumber() {
    await this.expectToBeVisibleByElement(this.phoneNumber);
    const getTitleAtt: any = await this.phoneNumber.getAttributes();
    const actualName = getTitleAtt.text;
    return actualName;
  }
}
