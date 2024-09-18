import { testIDs } from '../../src/testIds/testId';
import AmountInput from '../components/AmountInput';
import BasePage from './BasePage';

export default class ManualBankTransferPage extends BasePage {
  amountInputComponent = new AmountInput();
  async tapManualBankTransferOption() {
    return element(by.id(testIDs.ManualBankTransfer)).tap();
  }

  async tapManualBankTransferHistoryOption() {
    return element(by.id(testIDs.ManualBankTransferHistory)).tap();
  }

  get nextBtn() {
    return element(by.id(testIDs.NextBtn));
  }

  get transferDescription() {
    return element(by.id('description'));
  }

  async enterBankTransferAmount(amount: string) {
    return element(by.id(testIDs.ManualBankAmountInput)).typeText(amount);
  }

  async clearText() {
    // await addMsg({ message: `Enter the amount: ${amount}` });
    await element(by.id(testIDs.ManualBankAmountInput)).clearText();
  }

  async tapNextBtn() {
    return this.nextBtn.tap();
  }

  async tapCloseBtn() {
    return element(by.id(testIDs.CloseBtn)).tap();
  }

  async enterTransactionId(id: string) {
    await element(by.id(testIDs.TextInput)).tap();
    await element(by.id(testIDs.TextInput)).typeText(id);
  }

  async tapLastTransferRequest() {
    return element(by.id('TransactionItem-0')).tap();
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
    const isDescriptionVisible = await this.wait(descriptionId, 20000);
    await this.amountInputComponent.assertAmountDescriptionById(
      descriptionId,
      description,
    );
    return isDescriptionVisible;
  }
}
