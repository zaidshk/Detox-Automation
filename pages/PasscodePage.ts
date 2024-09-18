import { log } from 'detox';

import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export interface IPasscodePagePage {
  enterPasscode(passcode: string): void;
}

export default class PasscodePage extends BasePage {
  get title() {
    return element(by.id('coreText-title-passcode-verification-label'));
  }

  async verifyTitle() {
    await this.expectToBeVisibleByElement(this.title);
    const getTitleAtt: any = await this.title.getAttributes();
    const title = getTitleAtt.text;
    log.info('TITLE', title);
    return title;
  }

  async enterPasscode(passcode: string) {
    await device.disableSynchronization();
    for (let i = 0; i < passcode.length; i++) {
      await element(by.id(passcode.charAt(i))).tap();
    }
    await addMsg({ message: `Enter passcode ${passcode}` });
    await device.enableSynchronization();
  }
}
