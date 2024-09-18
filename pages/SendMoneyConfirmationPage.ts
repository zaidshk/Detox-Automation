import { expect as jestExpect } from '@jest/globals';
import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import { Currency } from '../../src/types/commons';
import { amountToStringWithSubunits } from '../../src/utils/amount';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class SendMoneyConfirmationPage extends BasePage {
  get contactNumber() {
    return element(by.id(testIDs.CheckoutContactNumber));
  }
  get countryName() {
    return element(by.id(testIDs.TransactionDetailCountry));
  }
  get amountYouSend() {
    return element(by.id(testIDs.TransactionDetailYousend));
  }
  get amountYouReceive() {
    return element(by.id(testIDs.TransactionDetailTheyreceive));
  }
  get fee() {
    return element(by.id(testIDs.TransactionDetailFee));
  }
  get total() {
    return element(by.id(testIDs.TransactionDetailTotal));
  }
  get nextBtn() {
    return element(by.id('next'));
  }

  async tapNext() {
    await addMsg({ message: 'Tap on Next button' });
    return this.nextBtn.tap();
  }

  async verifyReceiver() {
    const getAtt: any = await this.contactNumber.getAttributes();
    const actualReceiverNumber = getAtt.text;
    return actualReceiverNumber;
  }

  async verifyCheckoutDetails(
    country: string,
    receiverCountry: string,
    amountString: string,
    senderCurrency: string,
    receiverCurrency: string,
  ) {
    const results = {};
    //Assertion for Country value
    if (receiverCurrency !== 'USD') {
      const getCountryAtt: any = await this.countryName.getAttributes();
      jestExpect(getCountryAtt.text).toEqual(receiverCountry);
      await addMsg({
        message: `Verify Receiver Country :${getCountryAtt.text === receiverCountry ? 'PASS' : 'FAIL'
          }. Expected receiver country: ${receiverCountry}. Actual receiver country on app UI: ${getCountryAtt.text
          }`,
      });
    } else if (receiverCurrency === 'USD') {
      jestExpect(
        await this.expectToBeVisibleByElement(this.countryName),
      ).toEqual(false);
    }

    //Assertion for You Send value
    const youSendAmount: string = amountString;
    const formattedSendAmount = amountToStringWithSubunits(
      amountString,
      senderCurrency as Currency,
    ).replace(/^[^\d.\s/g]*/, '').trim();
    const getAtt: any = await this.amountYouSend.getAttributes();
    const actualYouSend = getAtt.text.replace(/^[^\d.\s/g]*/, '').trim();
    //Assertion for They Receive value
    let receiveAmount = '';
    let formattedReceiveAmount = '';
    if (senderCurrency === receiverCurrency) {
      receiveAmount = youSendAmount;
      formattedReceiveAmount = amountToStringWithSubunits(
        receiveAmount,
        receiverCurrency as Currency,
      ).replace(/^[^\d.\s/g]*/, '').trim();
      const getReceiveAmountAtt: any =
        await this.amountYouReceive.getAttributes();
      jestExpect(getReceiveAmountAtt.text.replace(/^[^\d.\s/g]*/, '').trim()).toEqual(
        formattedReceiveAmount.replace(/^[^\d.\s/g]*/, '').trim(),
      );
      await addMsg({
        message: `Verify They Receive amount :${getReceiveAmountAtt.text.replace(/^[^\d.\s/g]*/, '').trim() === formattedReceiveAmount.replace(/^[^\d.\s/g]*/, '').trim() ? 'PASS' : 'FAIL'
          }. Expected They Receive Amount: ${formattedReceiveAmount}. Actual They Receive Amount on app UI: ${getReceiveAmountAtt.text
          }`,
      });
    } else if (senderCurrency !== receiverCurrency) {
      //  senderCurrency* rate
      receiveAmount = youSendAmount;
      formattedReceiveAmount = amountToStringWithSubunits(
        receiveAmount,
        receiverCurrency as Currency,
      ).replace(/^[^\d.\s/g]*/, '').trim();
    }

    //Assertion for Fee value
    const fee: string =
      this.calculateFee(amountString, senderCurrency) ?? '0.00';
    log.info('FEE **', fee);
    let formattedFeeAmount: string = amountToStringWithSubunits(
      fee,
      senderCurrency as Currency,
    ).replace(/^[^\d.\s/g]*/, '').trim();
    const getFeeAtt: any = await this.fee.getAttributes();
    formattedFeeAmount =
      formattedFeeAmount?.replace(/^[^\d.\s/g]*/, '').trim() || `${senderCurrency} ${fee}`.replace(/^[^\d.\s/g]*/, '').trim();
    const actualFee = getFeeAtt.text.replace(/^[^\d.\s/g]*/, '').trim();

    //Assertion for total value
    const total: string = this.calculateTotal(amountString, fee); //youSendAmount;
    let formattedTotalAmount: string = amountToStringWithSubunits(
      total,
      senderCurrency as Currency,
    ).replace(/^[^\d.\s/g]*/, '').trim();
    formattedTotalAmount =
      formattedTotalAmount?.replace(/^[^\d.\s/g]*/, '').trim() || `${senderCurrency} ${total}`.replace(/^[^\d.\s/g]*/, '').trim();
    const getTotAtt: any = await this.total.getAttributes();
    const actualTotal = getTotAtt.text.replace(/^[^\d.\s/g]*/, '').trim();
    return {
      actualTotal,
      formattedTotalAmount,
      actualFee,
      formattedFeeAmount,
      actualYouSend,
      formattedSendAmount,
    };
  }
}
