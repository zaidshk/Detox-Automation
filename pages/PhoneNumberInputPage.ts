import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export interface IPhoneNumberInputPage {
  tapNext(): void;
  enterNumber(phoneNumber: string): void;
}

export default class PhoneNumberInputPage
  extends BasePage
  implements IPhoneNumberInputPage
{
  get nextBtn() {
    return element(by.id(testIDs.NextBtn));
  }

  get phoneNumberInput() {
    return element(by.id(testIDs.PhoneInput));
  }

  async tapNext() {
    await addMsg({ message: 'Tap on Next button' });
    return this.nextBtn.tap();
  }

  async enterNumber(phoneNumber: string) {
    await addMsg({ message: `Enter Phone number ${phoneNumber}` });
    return this.phoneNumberInput.typeText(phoneNumber);
  }
}
