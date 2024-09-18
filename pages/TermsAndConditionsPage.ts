import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class TermsAndConditionsPage extends BasePage {
  get checkboxTC() {
    return element(by.id(testIDs.CheckboxTC));
  }
  get NextBtn() {
    return element(by.id(testIDs.Next));
  }

  async tapChkboxTC() {
    const ischeckboxTCVisible = await this.expectToBeVisibleByElement(
      this.checkboxTC,
    );
    await this.checkboxTC.tap();
    return ischeckboxTCVisible;
  }

  async tapNextBtn() {
    const isConfirmBtn = await this.expectToBeVisibleByElement(this.NextBtn);
    await this.NextBtn.tap();
    return isConfirmBtn;
  }
}
