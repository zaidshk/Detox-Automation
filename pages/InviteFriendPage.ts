import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class InviteFriendPage extends BasePage {
  get switchBarButton() {
    return element(by.id('switchBar'));
  }

  get readMoreButton() {
    return element(by.id('readMoreTouchable'));
  }

  async tapSwitchBarButton() {
    await this.expectToBeVisibleByElement(this.switchBarButton);
    await this.switchBarButton.tap();
  }

  async tapReadMoreButton() {
    await this.expectToBeVisibleByElement(this.readMoreButton);
    await this.readMoreButton.tap();
  }
}
