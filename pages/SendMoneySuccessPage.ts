import { expect as jestExpect } from '@jest/globals';
import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import { Currency } from '../../src/types/commons';
import { amountToStringWithSubunits } from '../../src/utils/amount';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class SendMoneySuccessPage extends BasePage {
  get countryName() {
    return element(by.id(testIDs.TransactionDetailValueCountry));
  }
  get amountYouSend() {
    return element(by.id(testIDs.TransactionDetailValueYousend));
  }
  get amountYouReceive() {
    return element(by.id(testIDs.TransactionDetailValueTheyreceive));
  }
  get feeAED() {
    return element(by.id(testIDs.TransactionDetailValueFee));
  }
  get fee() {
    return element(by.id(testIDs.TransactionDetailValueKESFee));
  }
  get total() {
    return element(by.id(testIDs.TransactionDetailValueTotal));
  }

  get status() {
    return element(by.id(testIDs.TransactionDetailStatus));
  }

  get backHomeBtn() {
    return element(by.id('backHome'));
  }
  get closeBtn() {
    return element(by.id(testIDs.CloseBtn));
  }
  async tapCloseBtn() {
    await this.closeBtn.tap();
  }
  async tapBackHome() {
    await addMsg({ message: 'Navigate back to Dashboard page' });
    return this.backHomeBtn.tap();
  }

  async verifyTransactionStatus(country: string, receiverCountry: string) {
    await this.wait(testIDs.BackHomeBtn, 7000);
    const getAtt: any = await this.status.getAttributes();
    let expectedStatus = '';
    if (country === receiverCountry) {
      expectedStatus = 'Confirmed';
    } else if (country !== receiverCountry) {
      expectedStatus = 'Pending';
    }
    log.info('STATUS', getAtt);
    const actualStatus = getAtt.elements[0].text;
    log.info('STATUSINFO', actualStatus);
    return { actualStatus, expectedStatus };
  }

  async verifyTransactionDetails(
    country: string,
    receiverCountry: string,
    amountString: string,
    senderCurrency: string,
    receiverCurrency: string,
  ) {
    //Assertion for Country value
    const getCountryAtt: any = await this.countryName.getAttributes();
    if (receiverCurrency !== 'USD') {
      jestExpect(getCountryAtt.text).toEqual(receiverCountry);
      await addMsg({
        message: `Verify Receiver Country :${
          getCountryAtt.text === receiverCountry ? 'PASS' : 'FAIL'
        }. Expected receiver country: ${receiverCountry}. Actual receiver country on app UI: ${
          getCountryAtt.text
        }`,
      });
    } else if (receiverCurrency === 'USD') {
      jestExpect(getCountryAtt.text).toEqual('International');
      await addMsg({
        message: `Verify Receiver Country :${
          getCountryAtt.text === 'International' ? 'PASS' : 'FAIL'
        }. Expected receiver country: International. Actual receiver country on app UI: ${
          getCountryAtt.text
        }`,
      });
    }

    //Assertion for You Send value
    const youSendAmount: string = amountString;
    const formattedSendAmount = amountToStringWithSubunits(
      amountString,
      senderCurrency as Currency,
    );
    const getAtt: any = await this.amountYouSend.getAttributes();
    jestExpect(getAtt.text).toEqual(formattedSendAmount);
    await addMsg({
      message: `Verify You Send amount :${
        getAtt.text === formattedSendAmount ? 'PASS' : 'FAIL'
      }. Expected You Send Amount: ${formattedSendAmount}. Actual You Send Amount on app UI: ${
        getAtt.text
      }`,
    });

    //Assertion for They Receive value
    let receiveAmount = '';
    let formattedReceiveAmount = '';
    if (senderCurrency === receiverCurrency) {
      receiveAmount = youSendAmount;
      formattedReceiveAmount = amountToStringWithSubunits(
        receiveAmount,
        receiverCurrency as Currency,
      );
      const getReceiveAmountAtt: any =
        await this.amountYouReceive.getAttributes();
      jestExpect(getReceiveAmountAtt.text).toEqual(formattedReceiveAmount);
      await addMsg({
        message: `Verify They Receive amount :${
          getReceiveAmountAtt.text === formattedReceiveAmount ? 'PASS' : 'FAIL'
        }. Expected They Receive Amount: ${formattedReceiveAmount}. Actual They Receive Amount on app UI: ${
          getReceiveAmountAtt.text
        }`,
      });
    } else if (senderCurrency !== receiverCurrency) {
      //  senderCurrency* rate
      receiveAmount = youSendAmount;
      formattedReceiveAmount = amountToStringWithSubunits(
        receiveAmount,
        receiverCurrency as Currency,
      );
    }

    //Assertion for Fee value
    const fee: string =
      this.calculateFee(amountString, senderCurrency) ?? '0.00';
    let formattedFeeAmount: string = amountToStringWithSubunits(
      fee,
      senderCurrency as Currency,
    );
    let getFeeAtt: any;
    if (senderCurrency === 'AED') {
      getFeeAtt = await this.feeAED.getAttributes();
    } else {
      getFeeAtt = await this.fee.getAttributes();
    }
    formattedFeeAmount =
      formattedFeeAmount?.trim() || `${senderCurrency} ${fee}`;
    jestExpect(getFeeAtt.text).toEqual(formattedFeeAmount);
    await addMsg({
      message: `Verify Fee Amount:${
        getFeeAtt.text === formattedFeeAmount ? 'PASS' : 'FAIL'
      }. Expected Fee Amount: ${formattedFeeAmount}. Actual Fee Amount on app UI: ${
        getFeeAtt.text
      }`,
    });

    //Assertion for total value
    const total: string = this.calculateTotal(amountString, fee); //youSendAmount;
    let formattedTotalAmount: string = amountToStringWithSubunits(
      total,
      senderCurrency as Currency,
    );
    formattedTotalAmount =
      formattedTotalAmount?.trim() || `${senderCurrency} ${total}`;
    const getTotAtt: any = await this.total.getAttributes();
    jestExpect(getTotAtt.text).toEqual(formattedTotalAmount);
    await addMsg({
      message: `Verify Total Amount:${
        getTotAtt.text === formattedTotalAmount ? 'PASS' : 'FAIL'
      }. Expected Total Amount: ${formattedTotalAmount}. Actual Total Amount on app UI: ${
        getTotAtt.text
      }`,
    });
  }
}
