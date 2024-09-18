import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import AmountInput from '../components/AmountInput';
import { JestType, jestExpect } from '../utils/jestExpect';
import BasePage from './BasePage';

export default class CheckoutAmountPage extends BasePage {
  amountInputComponent = new AmountInput();

  get amountInput() {
    return this.amountInputComponent.amountInput;
  }

  get cardNumberInput() {
    return element(by.id(testIDs.CardNumberInput));
  }

  get cardExpiryInput() {
    return element(by.id(testIDs.CardExpiryInput));
  }

  get cardCVVInput() {
    return element(by.id(testIDs.CardCVVInput));
  }

  get topUpBtn() {
    return element(by.id(testIDs.TopUpBtn));
  }

  get debitCardBtn() {
    return element(by.id(testIDs.DebitCardBtn));
  }
  async enterAmount(amount: string) {
    // await addMsg({ message: `Enter the amount: ${amount}` });
    return this.amountInputComponent.enterAmount(amount);
  }

  async enterCardDetails(number: string, expiry: string, cvv: string) {
    await this.cardNumberInput.typeText(number);
    await this.cardExpiryInput.typeText(expiry);
    await this.cardCVVInput.typeText(cvv);
    return;
  }

  async tapTopUpBtn() {
    const isTopUpBtnVisible = await this.expectToBeVisibleByElement(
      this.topUpBtn,
    );
    await this.topUpBtn.tap();
    return isTopUpBtnVisible;
  }
  async isTopUpBtnVisible() {
    const isTopUpBtnVisible = await this.expectToBeVisibleByElement(
      this.topUpBtn,
    );
    return isTopUpBtnVisible;
  }

  async tapCloseBtn() {
    await element(by.id(testIDs.CloseBtn)).tap();
  }

  async checkoutFlow(cardNumber: string, cardExpiry: string, cardCVV: string) {
    await this.enterCardDetails(cardNumber, cardExpiry, cardCVV);
    await this.enterCardDetails(cardNumber, cardExpiry, cardCVV);
    await element(by.id(testIDs.TopUpBtn)).tap();
    await new Promise(resolve => setTimeout(resolve, 30000));
    await element(by.id(testIDs.CloseBottomSheetBtn)).tap();
    return;
  }

  async verifyCheckoutCompletedStatus(
    title: string,
    status: string,
    amount: string,
  ) {
    const isTitleVisible = await this.expectToBeVisible('coreText-title');
    const isStatusVisible = await this.expectToBeVisible('coreText-status');
    const isAmountVisible = await this.expectToBeVisible('coreText-amount');
    log.info(
      'verifyCheckoutCompletedStatus **',
      isTitleVisible,
      isStatusVisible,
      isAmountVisible,
    );
    if (title) {
      const getTitleAtt: any = await element(
        by.id('coreText-title'),
      ).getAttributes();
      const titleText = getTitleAtt.text;

      jestExpect(
        `Check Title Visible: ${isTitleVisible}`,
        isTitleVisible,
        true,
        JestType.equals,
      );

      jestExpect(
        `Check Title: ${titleText}`,
        titleText,
        title,
        JestType.equals,
      );
    }

    if (status) {
      const getStatusAtt: any = await element(
        by.id('coreText-status'),
      ).getAttributes();
      const statusText = getStatusAtt.text;

      jestExpect(
        `Check Status Visible: ${isStatusVisible}`,
        isStatusVisible,
        true,
        JestType.equals,
      );

      jestExpect(
        `Check Status: ${statusText}`,
        statusText,
        status,
        JestType.equals,
      );
    }

    if (status === 'Confirmed' && amount) {
      const getAmountAtt: any = await element(
        by.id('coreText-amount'),
      ).getAttributes();
      const amountText = getAmountAtt.text;

      jestExpect(
        `Check Amount Visible: ${isAmountVisible}`,
        isAmountVisible,
        true,
        JestType.equals,
      );

      jestExpect(
        `Check Amount: ${amountText}`,
        amountText,
        amount,
        JestType.equals,
      );
    }

    return;
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
//module.exports = new CheckoutAmountPage();
