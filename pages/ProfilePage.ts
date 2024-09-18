import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class ProfilePage extends BasePage {
  get title() {
    return element(by.text('Edit Profile'));
  }
  get name() {
    return element(by.id('coreText-name-subTitle'));
  }
  get phoneNumber() {
    return element(by.id('coreText-phone-number-national-number'));
  }
  get phoneNumberVerified() {
    return element(by.id('coreText-settingItem-phoneNumber-verified'));
  }
  get nickName() {
    return element(by.id('coreText-nickname-subTitle'));
  }
  get language() {
    return element(by.id('coreText-language-subTitle'));
  }
  get birthDate() {
    return element(by.id('coreText-dateOfBirth-subTitle'));
  }
  get email() {
    return element(by.id('coreText-email-subTitle'));
  }
  get address() {
    return element(by.id('coreText-residential-address-label'));
  }
  get changePasscode() {
    return element(by.id('passcode-setting-menu-image'));
  }
  get modalOkayBtn() {
    return element(by.id('modal-button-Ok'));
  }

  async verifyTitle() {
    const isTitle = await this.expectToBeVisibleByElement(this.title);
    return isTitle;
  }
  async verifyName() {
    const isName = await this.expectToBeVisibleByElement(this.name);
    return isName;
  }
  async verifyNickName() {
    const isNickName = await this.expectToBeVisibleByElement(this.nickName);
    return isNickName;
  }
  async verifyPhoneNumber() {
    const isPhoneNumber = await this.expectToBeVisibleByElement(
      this.phoneNumber,
    );
    return isPhoneNumber;
  }
  async verifyLanguage() {
    const isLanguage = await this.expectToBeVisibleByElement(this.language);
    return isLanguage;
  }
  async verifyBirthDate() {
    const isBirthDate = await this.expectToBeVisibleByElement(this.birthDate);
    return isBirthDate;
  }
  async verifyEmail() {
    const isEmail = await this.expectToBeVisibleByElement(this.email);
    return isEmail;
  }
  async verifyAddress() {
    const isAddress = await this.expectToBeVisibleByElement(this.address);
    return isAddress;
  }
  async tapChangePasscode() {
    await this.scrollToBottom('KeyboardAwareScrollView');
    await this.expectToBeVisibleByElement(
      element(by.id('coreText-passcode-menu-settingsTxtLabel')),
    );

    await this.expectToBeVisibleByElement(this.changePasscode);
    await this.changePasscode.tap();
  }
  async tapModalOkay() {
    await this.expectToBeVisibleByElement(this.modalOkayBtn);
    await this.modalOkayBtn.tap();
  }
}
