import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class HelpPage extends BasePage {
  get helpTitle() {
    return element(by.id('ImageSVG'));
  }
  async verifyHelpTitle() {
    const isTitle = await this.expectToBeVisibleByElement(this.helpTitle);
    return isTitle;
  }
}
