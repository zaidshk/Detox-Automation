import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class SourceOfFundsPage extends BasePage {
  get sofTitle() {
    return element(by.text('Source of funds'));
  }
  get occupationBtn() {
    return element(by.id('profession'));
  }
  get sectorBtn() {
    return element(by.id('sector'));
  }
  get subSectorBtn() {
    return element(by.id('subSector'));
  }
  get incomeRangeBtn() {
    return element(by.id('incomeRange'));
  }
  get sofBtn() {
    return element(by.id('sourceOfFunds'));
  }
  get turnOverBtn() {
    return element(by.id('turnoverRange'));
  }
  get updateBtn() {
    return element(by.id('sourceOfFunds-update-button'));
  }
  get nextBtn() {
    return element(by.text('Next'));
  }
  get occupationValue() {
    return element(by.id(testIDs.occupationValue));
  }
  get sectorValue() {
    return element(by.id('sector0'));
  }
  get subSectorValue() {
    return element(by.id('subSector0:0'));
  }
  get incomeRangeValue() {
    return element(
      //by.id('incomeRangeFrom1000100To1500000-bottomSheetCell-touchable'),
      by.id('incomeRangeFrom500100To1000000')
    );
  }
  get turnOverValue() {
    return element(
      by.id('turnoverRangeFrom500100To1000000'),//-bottomSheetCell-touchable
    );
  }
  get sofValue() {
    return element(by.id('sourceOfFunds0'));//sourceOfFunds1-bottomSheetCell-touchable
  }
  get modalOk() {
    return element(by.id('modal-button-Okay'));
  }
  async tapSelectSof() {
    await this.scrollToBottom('sourceOfFunds-scrollView');
    await this.sofBtn.tap();
    await this.sofValue.tap();
  }
  async tapSelectTurnOver() {
    await this.scrollToBottom('sourceOfFunds-scrollView');
    await this.turnOverBtn.tap();
    await this.turnOverValue.tap();
  }
  async verifySOFTitle() {
    const getTitle: any = await this.sofTitle.getAttributes();
    log.info('SOF Title', getTitle);
    const attribute = getTitle?.elements ? getTitle.elements[0] : getTitle;
    let actualTitle = attribute.text;
    return actualTitle;
  }

  async tapOccupation() {
    await this.expectToBeVisibleByElement(this.occupationBtn);
    await this.occupationBtn.tap();
  }

  async selectOccupationOptionFromBottomSheet() {
    await this.expectToBeVisibleByElement(this.occupationValue);
    await this.occupationValue.tap();
  }

  async tapSector() {
    await this.expectToBeVisibleByElement(this.sectorBtn);
    await this.sectorBtn.tap();
  }

  async selectSectorOptionFromBottomSheet() {
    await this.expectToBeVisibleByElement(this.sectorValue);
    await this.sectorValue.tap();
  }

  async tapSubSector() {
    await this.expectToBeVisibleByElement(this.subSectorBtn);
    await this.subSectorBtn.tap();
  }
  async selectSubSectorOptionFromBottomSheet() {
    await this.expectToBeVisibleByElement(this.subSectorValue);
    await this.subSectorValue.tap();
  }

  async tapIncomeRange() {
    await this.expectToBeVisibleByElement(this.incomeRangeBtn);
    await this.incomeRangeBtn.tap();
  }
  async selectIncomeRangeOptionFromBottomSheet() {
    await this.expectToBeVisibleByElement(this.incomeRangeValue);
    await this.incomeRangeValue.tap();
  }

  async tapUpdateBtn() {
    await this.expectToBeVisibleByElement(this.updateBtn);
    await this.updateBtn.tap();
  }
  async tapNextBtn() {
    await this.expectToBeVisibleByElement(this.nextBtn);
    await this.nextBtn.tap();
  }
  async tapModalOkayBtn() {
    await this.expectToBeVisibleByElement(this.modalOk);
    await this.modalOk.tap();
  }
}
