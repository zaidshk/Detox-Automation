import { element, expect, log } from 'detox';

import { JestType, jestExpect } from '../utils/jestExpect';

//import data from '../data/sendMoney/feeP2P.json';

const globalAny: any = global;
const data = require('../data/CI/sendMoney/feeP2P.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');

class BasePage {
  async clickById(id: string) {
    await element(by.id(id)).tap();
  }

  async waitAndClickById(id: string, waitFor = 2000) {
    await new Promise(resolve => setTimeout(resolve, waitFor));
    await element(by.id(id)).tap();
  }

  async waitAndTypeText(id: string, text: string, waitFor = 2000) {
    await new Promise(resolve => setTimeout(resolve, waitFor));
    await element(by.id(id)).typeText(text);
  }

  async wait(id: string, timeout = 5000) {
    try {
      await waitFor(element(by.id(id)))
        .toBeVisible()
        .withTimeout(timeout);
      return true;
    } catch (e) {
      log.info('expectToBeVisible', false);
      return false;
    }
  }

  async expectToBeVisibleByElement(element: Detox.NativeElement) {
    try {
      await expect(element).toBeVisible(10);
      const getAtt: any = await element.getAttributes();
      log.info('ELEMENTATT', getAtt);
      await addMsg({
        message: `'${
          getAtt.label || getAtt.identifier
        }' expect to be visible: true`,
      });
      return true;
    } catch (e) {
      await addMsg({ message: 'Expected Element to be visible: FAIL' });
      log.info('FAIL');
      return false;
    }
  }

  async expectToBeVisible(id: string) {
    try {
      await expect(element(by.id(id))).toBeVisible(10);
      log.info(`expectToBeVisible - ${id} :`, true);
      return true;
    } catch (e) {
      log.info(`expectToBeVisible - ${id} :`, false);
      return false;
    }
  }

  async expectToExist(id: string) {
    try {
      await expect(element(by.id(id))).toExist();
      log.info(`expectToExist: ${id}`, true);
      return true;
    } catch (e) {
      log.info(`expectToExist: ${id}`, false);
      return false;
    }
  }

  async expectToBeFocused(id: string) {
    try {
      await expect(element(by.id(id))).toBeFocused();
      log.info('expectToBeFocused', true);
      return true;
    } catch (e) {
      log.info('expectToBeFocused', false);
      return false;
    }
  }

  async scrollByPixel(id: string, direction: any = 'bottom', pixel = 50) {
    try {
      return element(by.id(id)).scroll(pixel, direction);
    } catch (error: any) {
      log.info('scrollByPixel:', error);
      if (error.message.includes('View is already at the scrolling edge')) {
        // Ignore the error
        log.info('scrollByPixel: View is already at the scrolling edge');
      } else {
        // Rethrow the error
        throw error;
      }
    }
  }

  async swipeByPercentage(
    id: string,
    direction: any = 'bottom',
    speed: any = 'fast',
    percent = 5,
  ) {
    return element(by.id(id)).swipe(direction, speed, percent);
  }

  async scrollToBottom(id: string, waitFor = 3000) {
    await new Promise(resolve => setTimeout(resolve, waitFor));
    return element(by.id(id)).scrollTo('bottom');
  }

  async scrollToRight(id: string) {
    return element(by.id(id)).scrollTo('right');
  }

  calculateFee(amount: string, senderCurrency: string) {
    let fee = '';
    if (senderCurrency === 'AED') {
      const parsedAmount: number = parseFloat(amount);
      return (fee = (
        parsedAmount > data.AED.minimumAmount ? data.AED.fee : 0
      ).toString());
    } else if (senderCurrency === 'KES') {
      return (fee = data.KES.minimumAmount.toString());
    } else if (senderCurrency === 'USD') {
      let fee: number = data.USD.fee;
      const formattedAmount = parseFloat(amount);
      if (formattedAmount >= data.USD.minimumAmount) {
        const feeIncreases: number = Math.floor((formattedAmount - 5) / 2);
        fee += feeIncreases * data.USD.feeIncrement;
      }
      return fee.toString();
    }
  }

  calculateTotal(amount: string, fee: string) {
    const parsedFee = parseFloat(fee);
    const parsedAmount = parseFloat(amount);
    const total: number = parsedAmount + parsedFee;
    return total.toString();
  }

  calculateRemainingBalance(
    amount: string,
    cardRequestFee: string,
    cardReplcaeFee: string,
  ) {
    const parsedCardRequestFee = parseFloat(cardRequestFee) | 0;
    const parsedCardReplcaeFee = parseFloat(cardReplcaeFee) | 0;
    const parsedAmount = parseFloat(amount);
    const total: number =
      parsedAmount - (parsedCardRequestFee + parsedCardReplcaeFee);
    return total;
  }

  async validateAllElementsExist(elementsList: string[], exist = true) {
    for (const element of elementsList) {
      const isVisible = await this.expectToExist(element);
      const assert = jestExpect(
        `Is ${element} exist/visible ${isVisible}`,
        exist,
        isVisible,
        JestType.equals,
      );
    }
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

  async validateAllElementsVisibleInList(
    elementsList: string[],
    exist = true,
    scrollViewId: string,
    direction: any = 'down',
    pixel: number = 50,
    actionType: any = 'scroll',
    speed: any = 'slow',
    percentage: number = 0.1,
  ) {
    for (const element of elementsList) {
      log.info('test element', element);
      // if (element === 'scroll') {

      const isVisible = await this.expectToBeVisible(element);
      const assert = jestExpect(
        `Is ${element} exist/visible ${isVisible}`,
        exist,
        isVisible,
        JestType.equals,
      );
      if (actionType === 'scroll') {
        await this.scrollByPixel(scrollViewId, direction, pixel);
      } else {
        await this.swipeByPercentage(
          scrollViewId,
          direction,
          speed,
          percentage,
        );
      }
    }
  }

  async pullDownToRefresh(
    scrollViewId: string,
    direction: any = 'down',
    speed: any = 'fast',
  ) {
    await element(by.id(scrollViewId)).swipe(direction, speed, 0.5);
  }
}

export default BasePage;
