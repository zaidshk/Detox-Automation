//var BasePage = require ('./BasePage.js');
//var BasePage = require ('./BasePage.js');
import { expect as jestExpect } from '@jest/globals';
import { by, element } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class SendMoneyErrorPopUpPage extends BasePage {
  get modalSubTitle() {
    return element(by.id(testIDs.ModalSubTitle));
  }
  get modalTitle() {
    return element(by.id(testIDs.ModalTitle));
  }
  get modalOkBtn() {
    return element(by.id(testIDs.ModalOkBtn));
  }
  get modalCancelBtn() {
    return element(by.id(testIDs.ModalCancelBtn));
  }

  async verifyErrorModal(
    receiverType: string,
    modalTitle: string,
    modalSubTitle: string,
  ) {
    await this.expectToBeVisibleByElement(this.modalTitle);
    const getModalTitleAtt: any = await this.modalTitle.getAttributes();
    const getModalSubTitleAtt: any = await this.modalSubTitle.getAttributes();
    jestExpect(getModalTitleAtt.text).toEqual(modalTitle);
    jestExpect(getModalSubTitleAtt.text).toEqual(modalSubTitle);

    await addMsg({
      message: `Verify Error Modal Title And SubTitle: ${
        getModalTitleAtt.text === modalTitle ? 'PASS' : 'FAIL'
      }. Is Expected Modal message displayed for ${receiverType} User? ${
        getModalTitleAtt.visible
      }`,
    });

    if (receiverType === 'SELF') {
      await addMsg({ message: 'Tap on OK button' });
      await this.modalOkBtn.tap();
    } else if (receiverType === 'NEW') {
      await addMsg({ message: 'Tap on Cancel button' });
      await this.modalCancelBtn.tap();
    } else if (receiverType === 'NOROUTE') {
      await addMsg({ message: 'Tap on OK button' });
      await this.modalCancelBtn.tap();
    }
  }
}
