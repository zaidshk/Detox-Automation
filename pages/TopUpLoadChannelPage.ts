import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class TopUpLoadChannelPage extends BasePage {
  get debitCardBtn() {
    return element(by.id(testIDs.DebitCardBtn));
  }

  get topUpTitle() {
    return element(by.text('Top-up'));
  }
  get backBtn() {
    return element(by.id(testIDs.BackButton));
  }

  async verifyTopUpTitle() {
    const getTitleAttr: any = await this.topUpTitle.getAttributes();
    const titleText: string = getTitleAttr.text;
    return titleText;
  }

  async tapSavedDebitCard(last4Digit: string) {
    await new Promise(resolve => setTimeout(resolve, 15000));
    await element(by.id(last4Digit)).tap();
  }

  async tapDebitCardChannel() {
    const isDebitCardBtnVisible = await this.expectToBeVisibleByElement(
      this.debitCardBtn,
    );
    await this.debitCardBtn.tap();
    return isDebitCardBtnVisible;
  }

  async tapOnBankLoad() {
    return element(by.id(testIDs.BankTransfer)).tap();
  }

  async tapOnCashLoad() {
    return element(by.id(testIDs.CashLoad)).tap();
  }

  async tapLoadPaymentMethod(loadMethodName: string) {
    //Check for bottom sheet visiblity and then click on loadMethodType
    const isLoadMethodVisible = await this.expectToBeVisible(loadMethodName);
    if (isLoadMethodVisible) await this.clickById(loadMethodName);
  }

  async tapMobileWalletLoad(mobileWallet: string) {
    const isMobileWalletBtnVisible = await this.expectToBeVisible(mobileWallet);
    if (isMobileWalletBtnVisible) await this.clickById(mobileWallet);

    return isMobileWalletBtnVisible;
  }
  async navigateBack() {
    await this.expectToBeVisibleByElement(this.backBtn);
    await this.backBtn.tap();
  }
}
