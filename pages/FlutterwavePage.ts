import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import AmountInput from '../components/AmountInput';
import BasePage from './BasePage';

export default class FlutterwavePage extends BasePage {
  amountInputComponent = new AmountInput();

  get youLoadInput() {
    return element(by.id(testIDs.TopUpBtn));
  }

  get youPayInput() {
    return element(by.id(testIDs.TopUpBtn));
  }

  get topUpBtn() {
    return element(by.id(testIDs.TopUpBtn));
  }

  get getLoadAmountInput() {
    return element(by.id(testIDs.FlutterwaveLoadInput));
  }

  async enterAmount(amount: string) {
    // await addMsg({ message: `Enter the amount: ${amount}` });
    await this.getLoadAmountInput.typeText(amount);
  }

  async clearText() {
    // await addMsg({ message: `Enter the amount: ${amount}` });
    await this.getLoadAmountInput.clearText();
  }

  async tapTopUpBtn() {
    await new Promise(resolve => setTimeout(resolve, 15000));
    await this.expectToBeVisibleByElement(this.topUpBtn);
    await this.topUpBtn.tap();
  }

  async verifyFlutterwaveDialog() {
    log.info('verifyFlutterwaveDialog ***');
    await this.expectToBeVisible('flw-checkout-dialog');
  }

  async verifyRightDescription(
    descriptionTop: string,
    descriptionBottom: string,
  ) {
    await this.amountInputComponent.assertAmountRightDescription(
      descriptionTop,
      descriptionBottom,
    );
  }

  async verifyDescription(descriptionId: string, description: string) {
    await this.amountInputComponent.assertAmountDescriptionById(
      descriptionId,
      description,
    );
  }
}
