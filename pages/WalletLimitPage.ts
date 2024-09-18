import { log } from 'detox';

import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class WalletLimitPage extends BasePage {
  get stolenBtn() {
    return element(by.id('reason-STOLEN'));
  }
  get confirmBtn() {
    return element(by.id('nextBtn'));
  }

  get walletLimitTitle() {
    return element(by.id('coreText-walletLimitViewHeaderTitle'));
  }

  get walletLimitEditButton() {
    return element(by.id('edit-touchable'));
  }

  get walletLimitTextInput() {
    return element(by.id('walletLimitTextInput'));
  }

  get walletLimitWarningText() {
    return element(by.id('walletLimitWarningText'));
  }

  get modalOkayButton() {
    return element(by.id('modal-button-Okay'));
  }

  async verifyTitle() {
    const getAtt: any = await this.walletLimitTitle.getAttributes();
    const attribute = getAtt?.elements ? getAtt.elements[0] : getAtt;

    log.info('Wallet Limit Title', getAtt);
    let actualTitle = attribute.text;
    return actualTitle;
  }

  async walletLimitWarningVisible() {
    return this.expectToBeVisibleByElement(this.walletLimitWarningText);
  }

  async tapModalOkayButton() {
    await this.expectToBeVisibleByElement(this.modalOkayButton);
    await this.modalOkayButton.tap();
  }

  async editWalletLimit(limit: string) {
    await this.expectToBeVisibleByElement(this.walletLimitEditButton);
    await this.walletLimitEditButton.tap();
    await this.expectToBeVisibleByElement(this.walletLimitTextInput);
    await this.walletLimitTextInput.replaceText(limit);
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
