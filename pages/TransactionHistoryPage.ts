import { testIDs } from '../../src/testIds/testId';
import { getTime } from '../utils/helper';
import { JestType, jestExpect } from '../utils/jestExpect';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class TransactionHistoryPage extends BasePage {
  get filterBtn() {
    return element(by.text(testIDs.Filter));
  }
  get cardPurchaseInList() {
    return element(by.id('Card Purchase'));
  }
  get cardTransactionName() {
    return element(by.id(`coreText-${testIDs.TransactionName}`));
  }
  get cardTransactionTime() {
    return element(by.id(`coreText-${testIDs.TransactionTime}`));
  }
  get cardTransactionStatus() {
    return element(by.id(`coreText-${testIDs.TransactionStatus}`));
  }
  get cardTransactionDesc() {
    return element(by.id(`coreText-${testIDs.TransactionDescription}`));
  }

  get transactionItem() {
    return element(by.id(`transactionList-item-touchable`));
  }

  get cardTransactionAmount() {
    return element(by.id(`coreText-${testIDs.TransactionAmount}`));
  }
  get cardTransactionDetailValueCategory() {
    return element(by.id(`coreText-${testIDs.TransactionDetailValueCategory}`));
  }
  get backBtn() {
    return element(by.id('ImageSVG'));
  }

  get filterButton() {
    return element(by.id(testIDs.Filter));
  }

  async tapBackBtn() {
    await this.expectToBeVisibleByElement(this.backBtn);
    await this.backBtn.atIndex(0).tap();
  }
  async tabFilterBtn() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await this.filterBtn.atIndex(1).tap();
  }

  async tabCardPurchaseBtn() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await this.scrollToBottom(testIDs.TransactionTypeList);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const getTimeAtt: any = await this.cardPurchaseInList.getAttributes();
    await this.cardPurchaseInList.tap();
  }

  async verifyCardSubtitle() {
    const getNameAtt: any = await this.cardTransactionName.getAttributes();
    const actualName = getNameAtt.elements[0].text;
    return actualName;
  }

  async verifyCardTime(cardTime: string) {
    const getTimeAtt: any = await this.cardTransactionTime.getAttributes();
    const actualTime = getTimeAtt.elements[0].text.replace('/', '').trim();
    const formattedTime = await getTime(cardTime);
    return { formattedTime, actualTime };
  }
  async verifyCardStatus() {
    const getStatusAtt: any = await this.cardTransactionStatus.getAttributes();
    const actualStatus = getStatusAtt.elements[0].text;
    return actualStatus;
  }
  async tapCardStatus() {
    await element(by.id(`coreText-${testIDs.TransactionStatus}`))
      .atIndex(0)
      .tap();
  }
  async verifyCardDesc() {
    const getDescAtt: any = await this.cardTransactionDesc.getAttributes();
    const actualDesc = getDescAtt.elements[0].text;
    return actualDesc;
  }
  async verifyCardAmount() {
    const getAmtAtt: any = await this.cardTransactionAmount.getAttributes();
    const actualAmt = getAmtAtt.elements[0].text;
    return actualAmt;
  }
  async fetchTransactionsStatus() {
    const getStatusAtt: any = await this.cardTransactionStatus.getAttributes();
    return getStatusAtt.elements;
  }

  async fetchTransactionsTitle() {
    const getStatusAtt: any = await this.cardTransactionName.getAttributes();
    return getStatusAtt.elements;
  }

  async fetchTransactionsAmount() {
    const getStatusAtt: any = await this.cardTransactionAmount.getAttributes();
    return getStatusAtt.elements;
  }

  async fetchTransactionsDescription() {
    const getStatusAtt: any = await this.cardTransactionDesc.getAttributes();
    return getStatusAtt.elements;
  }

  async openFilter() {
    // const getFilterAtt: any = await this.filterButton.getAttributes();
    // log.info('openFilter', getFilterAtt);
    // await getFilterAtt.elements[0].tap();
    await this.filterButton.atIndex(1).tap();
  }
}
