import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class VerificationPage extends BasePage {
  get title() {
    return element(by.text('Document details'));
  }
  get statusLabel() {
    return element(by.text('Status'));
  }
  get statusText() {
    return element(by.text('Completed'));
  }
  get documentTypeLabel() {
    return element(by.text('Document Type'));
  }
  get firstName() {
    return element(by.text('First Name'));
  }
  get lastName() {
    return element(by.text('Last Name'));
  }
  get birthDate() {
    return element(by.text('Birth Date'));
  }
  get documentNum() {
    return element(by.text('Document Number'));
  }
  get nationality() {
    return element(by.text('Nationality'));
  }
  get updateBtn() {
    return element(by.text('Verify'));
  }
  get missingGovDoc() {
    return element(by.text('Government Issued Document'));
  }
  get missingSelfie() {
    return element(by.text('Selfie'));
  }

  async verifyDocTitle() {
    const isDocTitle = await this.expectToBeVisibleByElement(this.title);
    return isDocTitle;
  }
  async verifyStatus() {
    const isStatusLabel = await this.expectToBeVisibleByElement(
      this.statusLabel,
    );
    const isStatusText = await this.expectToBeVisibleByElement(this.statusText);
    return { isStatusLabel, isStatusText };
  }
  async verifyFirstName() {
    const isFirstName = await this.expectToBeVisibleByElement(this.firstName);
    return isFirstName;
  }
  async verifyLastName() {
    const isLastName = await this.expectToBeVisibleByElement(this.lastName);
    return isLastName;
  }
  async verifyBirthDate() {
    const isBirthDate = await this.expectToBeVisibleByElement(this.birthDate);
    return isBirthDate;
  }
  async verifyDocNum() {
    const isDocNum = await this.expectToBeVisibleByElement(this.documentNum);
    return isDocNum;
  }
  async verifyNationality() {
    const isNationality = await this.expectToBeVisibleByElement(
      this.nationality,
    );
    return isNationality;
  }
  async tapConfirmBtn() {
    const isConfirmBtn = await this.expectToBeVisibleByElement(this.updateBtn);
    await this.updateBtn.tap();
    return isConfirmBtn;
  }
  async verifyMissingDocs() {
    const isMissingGovDoc = await this.expectToBeVisibleByElement(
      this.missingGovDoc,
    );
    const isMissingSelfie = await this.expectToBeVisibleByElement(
      this.missingSelfie,
    );
    return { isMissingGovDoc, isMissingSelfie };
  }
}
