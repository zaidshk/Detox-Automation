import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class CardBlockPage extends BasePage {
  get stolenBtn() {
    return element(by.id('reason-STOLEN-Touchable'));
  }
  get confirmBtn() {
    return element(by.id(testIDs.ConfirmBtn));
  }

  async tapStolenCard() {
    await this.expectToBeVisibleByElement(this.stolenBtn);
    await this.stolenBtn.tap();
  }

  async tapConfirmBtn() {
    await this.expectToBeVisibleByElement(this.confirmBtn);
    await this.confirmBtn.tap();
  }
}
