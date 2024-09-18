import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

export default class CardCustomisePage extends BasePage {
  get virtualCardPageTitle() {
    return element(by.id(testIDs.CustomizeCardScreenTitle));
  }

  get nameOnCard() {
    return element(by.id(testIDs.CardNameTxt));
  }

  get nameInputField() {
    return element(by.id(testIDs.NameInput));
  }

  get confirmBtn() {
    return element(by.id(testIDs.ConfirmBtn));
  }
  get closeBtn() {
    return element(by.id(testIDs.CloseNavButton));
  }

  get modelConfirmBtn() {
    return element(by.id(testIDs.ModalConfirmBtn));
  }
  get cardNameTxt() {
    return element(by.id(testIDs.CardNameTxt));
  }

  async tapConfirmBtn() {
    await new Promise(resolve => setTimeout(resolve, 10000));
    const isConfirmBtnVisible = await this.expectToBeVisibleByElement(
      this.confirmBtn,
    );
    await this.confirmBtn.tap();
    return isConfirmBtnVisible;
  }

  async verifyCardName() {
    await new Promise(resolve => setTimeout(resolve, 10000));
    const getNameCardAtt: any = await this.nameOnCard.getAttributes();
    const actualName = getNameCardAtt.text;
    const getNameInputAtt: any = await this.cardNameTxt.getAttributes();
    const expectedName = getNameInputAtt.text;
    return { actualName, expectedName };
  }

  async tapCloseBtn() {
    await new Promise(resolve => setTimeout(resolve, 10000));
    await this.expectToBeVisibleByElement(this.closeBtn);
    await this.closeBtn.tap();
    await this.modelConfirmBtn.tap();
  }
}
