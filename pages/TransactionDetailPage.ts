import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import { JestType, jestExpect } from '../utils/jestExpect';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class TransactionDetailPage extends BasePage {
  get closeBtn() {
    return element(by.id(testIDs.CloseBtn));
  }
  async tapCloseBtn() {
    await this.closeBtn.atIndex(0).tap();
  }
  get cardTransactionSubTitle() {
    return element(by.id(`coreText-${testIDs.TransactionName}`));
  }
  get cardTransactionTime() {
    return element(by.id(`coreText-${testIDs.TransactionTime}`));
  }
  get cardTransactionStatus() {
    return element(by.id(`coreText-${testIDs.TransactionDetailValueStatus}`));
  }
  get cardTransactionDesc() {
    return element(
      by.id(`coreText-${testIDs.TransactionDetailValueDescription}`),
    );
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

  async tapBackBtn() {
    await this.expectToBeVisibleByElement(this.backBtn);
    await this.backBtn.atIndex(0).tap();
  }

  async verifyCardPurchaseTransactionDetails() {
    await this.expectToBeVisibleByElement(this.cardTransactionSubTitle);

    const getTitleAtt: any = await this.cardTransactionSubTitle.getAttributes();
    const actualTitleName = getTitleAtt.elements[0].text;

    const getTimeAtt: any = await this.cardTransactionTime.getAttributes();
    const actualTime = getTimeAtt.elements[0].text;

    const getAmtAtt: any = await this.cardTransactionAmount.getAttributes();
    const actualAmt = getAmtAtt.elements[0].text;

    const getStatusAtt: any = await this.cardTransactionStatus.getAttributes();
    const actualStatus = getStatusAtt.elements[0].text;

    const getDescAtt: any = await this.cardTransactionDesc.getAttributes();
    const actualDesc = getDescAtt.elements[0].text;

    const getCategoryAtt: any =
      await this.cardTransactionDetailValueCategory.getAttributes();
    const actualCategory = getCategoryAtt.elements[0].text;

    return {
      actualTitleName,
      actualTime,
      actualAmt,
      actualStatus,
      actualDesc,
      actualCategory,
    };
  }

  async verifyPhysicalCardTransactionStatus() {
    await this.wait(testIDs.BackHomeBtn, 7000);
    const getAtt: any = await this.cardTransactionStatus.getAttributes();
    const expectedStatus = 'Created';
    log.info('STATUS', getAtt);
    const actualStatus = getAtt.text;
    log.info('STATUSINFO', actualStatus);
    return { actualStatus, expectedStatus };
  }

  async validateAllElementsVisible(elementsList: string[], exist = true) {
    for (const elementId of elementsList) {
      const getAtt: any = await element(by.id(elementId)).getAttributes();
      log.info('attributes **', getAtt);
      const attribute = getAtt?.elements ? getAtt.elements[0] : getAtt;

      const isVisible = attribute.visible;
      const assert = jestExpect(
        `Is ${elementId} exist/visible ${isVisible}`,
        exist,
        isVisible,
        JestType.equals,
      );
    }
  }
}
