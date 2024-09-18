import BasePage from './BasePage';

export default class HomeMenu extends BasePage {
  async tapLogout() {
    return element(by.id('menu-item-logOut')).tap();
  }

  async selectSourceOfFund() {
    return element(by.id('menu-item-source_of_funds')).tap();
  }

  async logOut() {
    await this.scrollToBottom('MenuScrollView');
    await this.tapLogout();
    await this.clickById('modal-button-Yes');
  }
}
