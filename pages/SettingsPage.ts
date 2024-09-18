import { log } from 'detox';

import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class SettingsPage extends BasePage {
  get helpBtn() {
    return element(by.id('menu-item-help'));
  }
  get inviteFriendBtn() {
    return element(by.id('menu-item-inviteFriend'));
  }
  get reportABugBtn() {
    return element(by.id('menu-item-report'));
  }
  get profileBtn() {
    return element(by.id('menu-item-profile'));
  }
  get verificationBtn() {
    return element(by.id('menu-item-verification'));
  }
  get authTransBtn() {
    return element(by.id('menu-item-authenticationTransaction'));
  }
  get sourceOfFundsBtn() {
    return element(by.id('menu-item-source_of_funds'));
  }
  get walletLimitBtn() {
    return element(by.id('menu-item-wallet-limit'));
  }
  get notificationsBtn() {
    return element(by.id('menu-item-notifications'));
  }
  get aboutUsBtn() {
    return element(by.id('menu-item-aboutUs'));
  }
  get privacyPolicyBtn() {
    return element(by.id('menu-item-privacyPolicy'));
  }
  get termsAndConditionsBtn() {
    return element(by.id('menu-item-termsAndConditions'));
  }
  get feesBtn() {
    return element(by.id('menu-item-fees'));
  }
  get logoutBtn() {
    return element(by.id('menu-item-logOut'));
  }

  async tapHelpBtn() {
    await this.expectToBeVisibleByElement(this.helpBtn);
    await this.helpBtn.tap();
  }
  async tapInviteFriendBtn() {
    await this.expectToBeVisibleByElement(this.inviteFriendBtn);
    await this.inviteFriendBtn.tap();
  }
  async tapReportABugBtn() {
    await this.expectToBeVisibleByElement(this.reportABugBtn);
    await this.reportABugBtn.tap();
  }
  async tapProfileBtn() {
    await this.expectToBeVisibleByElement(this.profileBtn);
    await this.profileBtn.tap();
  }
  async tapVerificationBtn() {
    const getAtt: any = await this.verificationBtn.getAttributes();
    log.info('ELEMENTATT', getAtt);
    const isVerificationVisible = getAtt.elements[0].visible;
    await this.verificationBtn.atIndex(0).tap();
    return isVerificationVisible;
  }
  async tapAuthOTPBtn() {
    await this.expectToBeVisibleByElement(this.authTransBtn);
    await this.authTransBtn.tap();
  }
  async tapSourceOfFundsBtn() {
    await this.expectToBeVisibleByElement(this.sourceOfFundsBtn);
    await this.sourceOfFundsBtn.tap();
  }
  async tapWalletLimitBtn() {
    await this.expectToBeVisibleByElement(this.walletLimitBtn);
    await this.walletLimitBtn.tap();
  }
  async tapNotificationBtn() {
    await this.expectToBeVisibleByElement(this.notificationsBtn);
    await this.notificationsBtn.tap();
  }
  async tapAboutUsBtn() {
    await this.expectToBeVisibleByElement(this.aboutUsBtn);
    await this.aboutUsBtn.tap();
  }
  async tapPrivacyPolicyBtn() {
    await this.expectToBeVisibleByElement(this.privacyPolicyBtn);
    await this.privacyPolicyBtn.tap();
  }
  async tapTermsAndConditionsBtn() {
    await this.expectToBeVisibleByElement(this.termsAndConditionsBtn);
    await this.termsAndConditionsBtn.tap();
  }
  async tapFeesBtn() {
    await this.expectToBeVisibleByElement(this.feesBtn);
    await this.feesBtn.tap();
  }
  async tapLogOutBtn() {
    await this.expectToBeVisibleByElement(this.logoutBtn);
    await this.logoutBtn.tap();
  }
}
