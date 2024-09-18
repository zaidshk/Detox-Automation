import { testIDs } from '../../src/testIds/testId';
import AmountInput from '../components/AmountInput';
import BasePage from './BasePage';

export default class StripeCardDetailsPage extends BasePage {
  amountInputComponent = new AmountInput();

  get amountInput() {
    return this.amountInputComponent.amountInput;
  }

  get topUpBtn() {
    return element(by.id(testIDs.TopUpBtn));
  }

  async enterAmount(amount: string) {
    await this.amountInputComponent.enterAmount(amount);
  }

  async tapTopUpBtn() {
    await new Promise(resolve => setTimeout(resolve, 15000));
    await this.expectToBeVisibleByElement(this.topUpBtn);
    await this.topUpBtn.tap();
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
}
