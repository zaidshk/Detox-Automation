import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class DashboardPage extends BasePage {
  get topUpBtn() {
    return element(by.id(testIDs.TopUpBtn));
  }

  get sendBtn() {
    return element(by.id(testIDs.SendMoneyBtn));
  }

  get profileBtn() {
    return element(by.id(testIDs.ProfileBtn));
  }

  get seeAllBtn() {
    return element(by.id(testIDs.SeeAllBtn));
  }

  get accountBalance() {
    return element(by.id(`coreText-${testIDs.CurrentAmountTxt}`));
  }

  get cardsBtn() {
    return element(by.id(testIDs.CardsBtn));
  }
  get accountsBtn() {
    return element(by.id('header-tab-0'));
  }

  async isDashboardVisible() {
    const isDashboardVisible = await this.expectToBeVisible(
      'coreText-CurrentAmountText',
    );
    return isDashboardVisible;
  }

  async tapCardsBtn() {
    const isCardBtnVisible = await this.expectToBeVisibleByElement(
      this.cardsBtn,
    );
    return this.cardsBtn.tap();
  }

  async tapAccountsBtn() {
    const isBtnVisible = await this.expectToBeVisibleByElement(
      this.accountsBtn,
    );
    return this.accountsBtn.tap();
  }

  async tapTopUpBtn() {
    const isTopUpBtnVisible = await this.expectToBeVisibleByElement(
      this.topUpBtn,
    );
    await this.topUpBtn.tap();
    return isTopUpBtnVisible;
  }

  async tapTopUpBtnNew() {
    await this.topUpBtn.tap();
  }

  async tapSendBtn() {
    const isSendBtnVisible = await this.expectToBeVisibleByElement(
      this.sendBtn,
    );
    await addMsg({
      message: `Check visiblity of Send Money Button and Click on it: ${
        isSendBtnVisible ? 'PASS' : 'FAIL'
      }. Expected: Is Send button visible? ${isSendBtnVisible}`,
    });
    return this.sendBtn.tap();
  }

  async tapProfileBtn() {
    await this.profileBtn.tap();
  }

  async tapSeeAllBtn() {
    await this.seeAllBtn.tap();
  }

  async verifyAccountBalance() {
    await this.expectToExist(`coreText-${testIDs.CurrentAmountTxt}`);
    const getAtt: any = await this.accountBalance.getAttributes();
    return getAtt.text;
  }

  async isAccountBalanceVisible() {
    return await this.expectToBeVisibleByElement(this.accountBalance);
  }
}
