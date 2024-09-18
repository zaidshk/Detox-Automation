import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class CardPricingPage extends BasePage {
  get nextBtn() {
    return element(by.id(testIDs.NextBtn));
  }
  get confirmBtn() {
    return element(by.id(testIDs.ConfirmBtn));
  }
  get fee() {
    return element(by.id(testIDs.TransactionDetailValuePhysicalcard));
  }

  async verifyFee() {
    await this.expectToBeVisibleByElement(this.fee);
    const getTitleAtt: any = await this.fee.getAttributes();
    const actualName = getTitleAtt.text;
    return actualName;
  }

  async tapNextBtn() {
    await this.expectToBeVisibleByElement(this.nextBtn);
    await this.nextBtn.tap();
  }
}
