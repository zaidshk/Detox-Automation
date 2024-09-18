import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class AuthenticationTransactionPage extends BasePage {
  get noTransactionTitle() {
    return element(by.id('modal-title'));
  }
  async verifyOTPNoTransactionModal() {
    const isTitle = await this.expectToBeVisibleByElement(
      this.noTransactionTitle,
    );
    return isTitle;
  }
}
