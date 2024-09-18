import { expect as jestExpect } from '@jest/globals';
import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import { getTime } from '../utils/helper';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class CardPage extends BasePage {
  get newCardBtn() {
    return element(by.id(testIDs.GetNewCard));
  }

  get anotherCardBtn() {
    return element(by.id(testIDs.GetAnotherCardBtn));
  }

  get cardNumberBtn() {
    return element(by.id(testIDs.CardNumberBtn));
  }

  get cardNumberTxt() {
    return element(by.id(testIDs.CardNumberTxt));
  }

  get cardNameTxt() {
    return element(by.id(testIDs.CardNameTxt));
  }

  get modelTitle() {
    return element(by.id(testIDs.ModalTitle));
  }

  get modelTopUpBtn() {
    return element(by.id('modal-button-Topup'));
  }

  get modelConfirmBtn() {
    return element(by.id(testIDs.ModalConfirmBtn));
  }

  get modelCancelBtn() {
    return element(by.id(testIDs.ModalCancelBtn));
  }
  get cardDetailsBtn() {
    return element(by.id(testIDs.CardDetailsBtn));
  }
  get cardFreezeBtn() {
    return element(by.id(testIDs.CardFreezeBtn));
  }

  get cardCustomizeBtn() {
    return element(by.id('selectItem-customizeCard'));
  }

  get cardBlockBtn() {
    return element(by.id(testIDs.CardBlockBtn));
  }
  get cardReplaceBtn() {
    return element(by.id(testIDs.CardReplaceBtn));
  }
  get cardSettingBtn() {
    return element(by.id(testIDs.CardSettingBtn));
  }
  get cardFrozenTxt() {
    return element(by.id(testIDs.CardStatusTxt));
  }
  get cardModalUnFreezeBtn() {
    return element(by.id('modal-button-Unfreeze'));
  }
  get cardModalReplaceBtn() {
    return element(by.id('modal-button-Replace'));
  }

  get cardTransactionSubTitle() {
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
  get cardTransactionAmount() {
    return element(by.id(`coreText-${testIDs.TransactionAmount}`));
  }
  get seeAll() {
    return element(by.text('See all'));
  }

  async tabSeeAll() {
    await this.expectToBeVisibleByElement(this.seeAll);
    await this.seeAll.tap();
  }

  async verifyCardLast4Digits(cardData: any) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const getNumAtt: any = await this.cardNumberTxt.getAttributes();
    const fullString = getNumAtt.elements[0].text;
    const actualCardLast4 = fullString.slice(-4);
    let expCardLast4;
    let cardID;

    const card = cardData?.data.find(
      (card: any) => card.cardLast4 === actualCardLast4,
    );
    if (card) {
      expCardLast4 = card.cardLast4;
      cardID = card.cardId;
      log.info(expCardLast4);
    }
    return { actualCardLast4, expCardLast4, cardID };
  }

  async verifyCardSubtitle() {
    const getTitleAtt: any = await this.cardTransactionSubTitle.getAttributes();
    const actualTitle = getTitleAtt.elements[0].text;
    return actualTitle;
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

  async tapModalReplaceBtn() {
    const isConfirmBtnVisible = await this.expectToBeVisibleByElement(
      this.cardModalReplaceBtn,
    );
    await new Promise(resolve => setTimeout(resolve, 15000));
    await this.cardModalReplaceBtn.tap();
    return isConfirmBtnVisible;
  }

  async tapReplaceBtn() {
    await new Promise(resolve => setTimeout(resolve, 15000));
    const isConfirmBtnVisible = await this.expectToBeVisibleByElement(
      this.cardReplaceBtn,
    );
    await this.cardReplaceBtn.tap();
    return isConfirmBtnVisible;
  }
  async tapModalUnfreezeBtn() {
    const isConfirmBtnVisible = await this.expectToBeVisibleByElement(
      this.cardModalUnFreezeBtn,
    );
    await new Promise(resolve => setTimeout(resolve, 5000));
    await this.cardModalUnFreezeBtn.tap();
    return isConfirmBtnVisible;
  }
  async verifyFrozenTxtOnCard() {
    await new Promise(resolve => setTimeout(resolve, 10000));
    const isTxtVisible = await this.expectToBeVisibleByElement(
      this.cardFrozenTxt,
    );
    const getNameAtt: any = await this.cardFrozenTxt.getAttributes();
    log.info('cardFrozenTxt attribute', getNameAtt);
    const visibleFrozenCard = getNameAtt?.elements?.filter((attribute: any) => {
      return attribute.visible === true;
    });
    log.info(
      'visibleFrozenCard',
      visibleFrozenCard,
      visibleFrozenCard?.[0].text,
    );
    const actualName = visibleFrozenCard?.[0].text;
    return actualName;
  }

  async tapModalConfirmBtn() {
    let isConfirmBtnVisible = false;
    try {
      isConfirmBtnVisible = await this.expectToBeVisibleByElement(
        this.modelConfirmBtn,
      );
      await this.modelConfirmBtn.tap();
    } catch (error) {
      log.info(error);
      if (isConfirmBtnVisible) {
        await this.modelConfirmBtn.tap();
      }
    }
    return isConfirmBtnVisible;
  }

  async tapNewCardBtn() {
    const isNewCardBtnVisible = await this.expectToBeVisibleByElement(
      this.newCardBtn,
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.newCardBtn.tap();
    return isNewCardBtnVisible;
  }

  async tapAnotherCardBtn() {
    const isAnotherCardBtnVisible = await this.expectToBeVisibleByElement(
      this.anotherCardBtn,
    );
    await this.anotherCardBtn.tap();
    return isAnotherCardBtnVisible;
  }

  async tapCardDetailsBtn() {
    const isCardDetailsBtnVisible = await this.expectToBeVisibleByElement(
      this.cardDetailsBtn,
    );
    await this.cardDetailsBtn.tap();
    return isCardDetailsBtnVisible;
  }

  async tapFreezeBtn() {
    const isBtnVisible = await this.expectToBeVisibleByElement(
      this.cardFreezeBtn,
    );
    await this.cardFreezeBtn.tap();
    return isBtnVisible;
  }

  async tapCustomizeCardBtn() {
    const isBtnVisible = await this.expectToBeVisibleByElement(
      this.cardCustomizeBtn,
    );
    await this.cardCustomizeBtn.tap();
    return isBtnVisible;
  }

  async tapBlockBtn() {
    let isBtnVisible = false;
    try {
      isBtnVisible = await this.expectToBeVisibleByElement(this.cardBlockBtn);
      await this.cardBlockBtn.tap();
    } catch (error) {
      log.info(error);
      if (isBtnVisible) {
        await this.cardBlockBtn.tap();
      }
    }
    return isBtnVisible;
  }
  async tapSettingsBtn() {
    const isBtnVisible = await this.expectToBeVisibleByElement(
      this.cardSettingBtn,
    );
    await this.cardSettingBtn.tap();
    return isBtnVisible;
  }

  async verifyAddVirtualCard(cardData: any) {
    if (cardData.count === 0) {
      const isNewCardVisible: boolean = await this.tapNewCardBtn();
      jestExpect(isNewCardVisible).toBe(true);
    } else if (cardData.count > 0) {
      if (cardData.count > 25) {
        await addMsg({
          message: `User's Paid Card service exceeds the available limits: ${
            cardData.count === 25 ? 'PASS' : 'FAIL'
          }.`,
        });
      }
      const isAnotherCardVisible: boolean = await this.tapAnotherCardBtn();
      jestExpect(isAnotherCardVisible).toBe(true);
    }
  }
  async verifyEmptyWalletModal() {
    const isEmptyWalletTitleVisible = await this.expectToBeVisibleByElement(
      this.modelTitle,
    );
    const getTitleAtt: any = await this.modelTitle.getAttributes();
    const actualName = getTitleAtt.text;
    return { isEmptyWalletTitleVisible, actualName };
  }
  async tapTopUpBtn() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await this.expectToBeVisibleByElement(this.modelTopUpBtn);
    await this.modelTopUpBtn.tap();
  }
  async tapCancelBtn() {
    await this.expectToBeVisibleByElement(this.modelCancelBtn);
    await this.modelCancelBtn.tap();
  }

  async verifyCardName() {
    await new Promise(resolve => setTimeout(resolve, 10000));
    const isTxtVisible = await this.expectToBeVisibleByElement(
      this.cardNameTxt,
    );
    log.info('isTxtVisible **', isTxtVisible);

    const getNameAtt: any = await this.cardNameTxt.getAttributes();
    log.info('CARDNAME **', getNameAtt);
    const actualName = getNameAtt.elements[getNameAtt.elements.length - 1].text;
    return actualName;
  }

  async scrollCardAndSelect() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await this.scrollToRight('CarouselScrollView');
  }
}
