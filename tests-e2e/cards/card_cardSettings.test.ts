import { expect as jestExpect } from '@jest/globals';
import { log } from 'detox';

import { Currency } from '../../../src/types/commons';
import { amountToStringWithSubunits } from '../../../src/utils/amount';
import CardBlockPage from '../../pages/CardBlockPage';
import CardBottomSheetPage from '../../pages/CardBottomSheetPage';
import CardCheckoutPage from '../../pages/CardCheckoutPage';
import CardCustomisePage from '../../pages/CardCustomisePage';
import CardDeliveryAddressPage from '../../pages/CardDeliveryAddressPage';
import CardPage from '../../pages/CardPage';
import CardPricingPage from '../../pages/CardPricingPage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import SendMoneySuccessPage from '../../pages/SendMoneySuccessPage';
import TransactionDetailPage from '../../pages/TransactionDetailPage';
import TransactionHistoryPage from '../../pages/TransactionHistoryPage';
import {
  getAccount,
  getAccountCards,
  getCardFees,
  getCardTransaction,
  getCardTransationHistory,
  getListServiceFeature,
  getToken,
  getUsername,
} from '../../utils/graphQL';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  firstUpperRestLower,
  getDefaultAccount,
  getDefaultBalance,
  printDeviceInformation,
} from '../../utils/helper';

//import data from '../../data/cardManagement/cardSettings.json';
const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/cardManagement/cardSettings.json`);

const { addAttach, addMsg } = require('jest-html-reporters/helper');
let attributes: any;
let serviceData: any;

/*PreTest : 
1.Make sure the account has atleast one Frozen card 
2. max number of card is not reached 
3. Account has balance
*/

describe.each(data)(
  'Card settings feature: Test with data for $country with phoneNumber:$phoneNumber',
  ({
    country,
    countryCode,
    phoneNumber,
    passcode,
    currency,
    city,
    logout,
    newInstance,
    desiredFeatureNames,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      country,
      countryCode,
      phoneNumber,
      passcode,
      currency,
      city,
      logout,
      newInstance,
      desiredFeatureNames,
    );
    const dashboardPage = new DashboardPage();
    const cardPage = new CardPage();
    const cardBottomSheetPage = new CardBottomSheetPage();
    const cardCustomisePage = new CardCustomisePage();
    const loginPage = new LoginPage();
    const sendMoneySuccessPage = new SendMoneySuccessPage();
    const cardCheckoutPage = new CardCheckoutPage();
    const cardBlockPage = new CardBlockPage();
    const cardPricingPage = new CardPricingPage();
    const cardDeliveryAddressPage = new CardDeliveryAddressPage();
    const transactionDetailPage = new TransactionDetailPage();
    const transactionHistoryPage = new TransactionHistoryPage();

    let formattedBalance = '';
    let cardFees: any;
    let balance: any;
    let cardFeesRes: any;
    let cardReplaceFeesRes: any;
    let cardPhysicalFeesRes: any;
    let token: any;
    let defaultAccount: any;

    log.info('***** data *******', data);
    beforeAll(async () => {
      await device.launchApp({
        delete: true,
        permissions: {
          location: 'always',
          notifications: 'YES',
          camera: 'YES',
          microphone: 'YES',
          contacts: 'YES',
          userTracking: 'YES',
        },
      });
    });
    beforeEach(async () => {
      await device.launchApp({
        newInstance: true,
      });
      log.info('beforeEach ****');
      log.info(
        '*** Describe dataSet for ***',
        country,
        countryCode,
        phoneNumber,
        passcode,
        currency,
        city,
        logout,
        newInstance,
      );
      const info = await printDeviceInformation(device);
      await addCustomLogToReporter(JSON.stringify(info));
      const userId = await getUsername(`${countryCode}${phoneNumber}`);
      log.info('username', userId);
      token = await getToken(userId, `${countryCode}${phoneNumber}`, passcode);
      const accounts = await getAccount(userId, token);
      defaultAccount = await getDefaultAccount(accounts);
      cardFeesRes = await getCardFees(
        token,
        defaultAccount,
        'issueVirtualCard',
      );
      cardReplaceFeesRes = await getCardFees(
        token,
        defaultAccount,
        'replaceCard',
      );
      cardPhysicalFeesRes = await getCardFees(
        token,
        defaultAccount,
        'issuePhysicalCard',
      );

      attributes = await getAccountCards(token, defaultAccount);
      serviceData = await getListServiceFeature(token, defaultAccount, userId);

      balance = getDefaultBalance(
        accounts,
        'default',
        currency as unknown as Currency,
      );
      log.info('default balance *** ', balance);
      formattedBalance = amountToStringWithSubunits(
        balance.amount,
        balance.currency as Currency,
      );
      log.info('formattedBalance *** ', formattedBalance);
    });

    it('Verify Virtual card service for add another card', async () => {
      try {
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapCardsBtn();
        await cardPage.verifyAddVirtualCard(attributes);
        await cardBottomSheetPage.verifyCardService(
          serviceData,
          desiredFeatureNames,
        );
        await cardBottomSheetPage.tapRequestVirtualCard();
        const isFeeAlertModalShown = await cardPage.tapModalConfirmBtn();
        await addMsg({
          message: `Verify Fee Alert modal for virtual card request:${
            isFeeAlertModalShown === true ? 'PASS' : 'FAIL'
          }.`,
        });
        jestExpect(isFeeAlertModalShown).toEqual(true);
        const cardDetails = await cardCustomisePage.verifyCardName();
        jestExpect(cardDetails.actualName).toEqual(cardDetails.expectedName);
        await addMsg({
          message: `Verify Name on virtual card in Card customise page:${
            cardDetails.actualName === cardDetails.expectedName
              ? 'PASS'
              : 'FAIL'
          }. Expected Card Name: ${
            cardDetails.expectedName
          }. Actual Card Name on app UI: ${cardDetails.actualName}`,
        });
        await cardCustomisePage.tapConfirmBtn();
        await cardCheckoutPage.tapConfirmBtn();
        const cardName = await cardPage.verifyCardName();
        await addMsg({
          message: `Verify Name on virtual card in Card Page:${
            cardName === cardDetails.expectedName ? 'PASS' : 'FAIL'
          }. Expected Card Name: ${cardName}. Actual Card Name on app UI: ${
            cardDetails.actualName
          }`,
        });
        jestExpect(cardName).toEqual(cardDetails.actualName);
      } catch (error) {
        log.info(`
             You did something wrong dummy!
             ${error}
           `);
        throw error;
      }
    });
    it('Verify freeze, unfreeze and block for virtual card', async () => {
      try {
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapCardsBtn();
        await cardPage.scrollCardAndSelect();
        await cardPage.tapCardDetailsBtn();
        const cardName = await cardPage.verifyCardName();
        await cardPage.tapFreezeBtn();
        const cardStatus = await cardPage.verifyFrozenTxtOnCard();
        await addMsg({
          message: `Verify card status after tap on Freeze button:${
            cardStatus === 'Frozen' ? 'PASS' : 'FAIL'
          }. Expected Text: Frozen. Actual Text: ${cardStatus}`,
        });
        jestExpect(cardStatus).toEqual('Frozen');
        await cardPage.tapFreezeBtn();
        await cardPage.tapModalUnfreezeBtn();
        const actualCardName = await cardPage.verifyCardName();
        await addMsg({
          message: `Verify Name on card after UnFreeze the card:${
            actualCardName === cardName ? 'PASS' : 'FAIL'
          }. Expected Name: ${cardName}. Actual Name: ${actualCardName}`,
        });
        await cardPage.tapFreezeBtn();
        await cardPage.tapBlockBtn();
        await cardPage.tapModalConfirmBtn();
        await cardBlockPage.tapStolenCard();
        await device.disableSynchronization();
        await cardBlockPage.tapConfirmBtn();
        await cardPage.tapModalConfirmBtn();
        await new Promise(resolve => setTimeout(resolve, 7000));
        await cardPage.tapReplaceBtn();
        await cardPage.tapModalReplaceBtn();
        const cardDetails = await cardCustomisePage.verifyCardName();
        jestExpect(cardDetails.actualName).toEqual(cardDetails.expectedName);
        await addMsg({
          message: `Verify Name on virtual card in Card customise page:${
            cardDetails.actualName === cardDetails.expectedName
              ? 'PASS'
              : 'FAIL'
          }. Expected Card Name: ${
            cardDetails.expectedName
          }. Actual Card Name on app UI: ${cardDetails.actualName}`,
        });
        await cardCustomisePage.tapConfirmBtn();
        await device.enableSynchronization();

        const cardNameTxt = await cardPage.verifyCardName();

        await addMsg({
          message: `Verify Name on virtual card in Card Page:${
            cardNameTxt === cardDetails.expectedName ? 'PASS' : 'FAIL'
          }. Expected Card Name: ${cardNameTxt}. Actual Card Name on app UI: ${
            cardDetails.actualName
          }`,
        });
        jestExpect(cardNameTxt).toEqual(cardDetails.actualName);
        await dashboardPage.tapAccountsBtn();
        const accountBalance = await dashboardPage.verifyAccountBalance();
        const expectedBalanceInNumber: number =
          dashboardPage.calculateRemainingBalance(
            balance.amount,
            cardFeesRes[0].amount,
            '0',
          );
        const expectedBalance = amountToStringWithSubunits(
          expectedBalanceInNumber,
          currency as Currency,
        );
        await addMsg({
          message: `Verify the Account Balance of the user in Dashboard page: ${
            accountBalance === expectedBalance ? 'PASS' : 'FAIL'
          }. Expected balance: ${expectedBalance}. Actual balance on app UI: ${accountBalance}`,
        });
        jestExpect(accountBalance).toEqual(expectedBalance);
      } catch (error) {
        log.info(`
             You did something wrong dummy!
             ${error}
           `);
        throw error;
      }
    });
    it('Verify Request Physical card service', async () => {
      try {
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapCardsBtn();
        await cardPage.verifyAddVirtualCard(attributes);
        const isPhysicalService = await cardBottomSheetPage.verifyCardService(
          serviceData,
          desiredFeatureNames,
        );
        log.info('isPhysicalService***', isPhysicalService);
        if (isPhysicalService) {
          await cardBottomSheetPage.tapRequestPhysicalCard();
          const isFeeAlertModalShown = await cardPage.tapModalConfirmBtn();
          await addMsg({
            message: `Verify Fee Alert modal for virtual card request:${
              isFeeAlertModalShown === true ? 'Yes' : 'No'
            }.`,
          });
          await cardPricingPage.tapNextBtn();
          await cardDeliveryAddressPage.enterAddress1('Address1');
          await cardDeliveryAddressPage.enterAddress2('Address2');
          await cardDeliveryAddressPage.enterArea('Area');
          await cardDeliveryAddressPage.selectCity(city);
          const actualCountryName =
            await cardDeliveryAddressPage.verifyCountry();
          await addMsg({
            message: `Verify the country of the user: ${
              actualCountryName === country ? 'PASS' : 'FAIL'
            }. Expected value: ${country}. Actual value on app UI: ${actualCountryName}`,
          });
          jestExpect(actualCountryName).toEqual(country);
          const actualPhoneNumber =
            await cardDeliveryAddressPage.verifyPhoneNumber();
          await addMsg({
            message: `Verify the Phone Number of the user: ${
              actualPhoneNumber === countryCode + phoneNumber ? 'PASS' : 'FAIL'
            }. Expected value: ${
              countryCode + phoneNumber
            }. Actual value on app UI: ${actualPhoneNumber}`,
          });
          jestExpect(actualPhoneNumber).toEqual(countryCode + phoneNumber);
          await cardDeliveryAddressPage.tapNextBtn();
          await device.disableSynchronization();
          await cardCheckoutPage.tapConfirmBtn();
          await cardCheckoutPage.tapModalConfirmBtn();
          await device.enableSynchronization();
          const transactionResult =
            await transactionDetailPage.verifyPhysicalCardTransactionStatus();
          await addMsg({
            message: `Verify Transaction Status:${
              transactionResult.actualStatus ===
              transactionResult.expectedStatus
                ? 'PASS'
                : 'FAIL'
            }. Expected Transaction Status: ${
              transactionResult.expectedStatus
            }. Actual Transaction Status on app UI: ${
              transactionResult.actualStatus
            }`,
          });
          jestExpect(transactionResult.actualStatus).toEqual(
            transactionResult.expectedStatus,
          );
          await sendMoneySuccessPage.tapCloseBtn();
          await transactionDetailPage.tapCloseBtn();
          const accountBalance = await dashboardPage.verifyAccountBalance();
          const expectedBalanceInNumber: number =
            dashboardPage.calculateRemainingBalance(
              balance.amount,
              cardPhysicalFeesRes[0].amount,
              '',
            );
          const expectedBalance = amountToStringWithSubunits(
            expectedBalanceInNumber,
            currency as Currency,
          );
          await addMsg({
            message: `Verify the Account Balance of the user in Dashboard page: ${
              accountBalance === expectedBalance ? 'PASS' : 'FAIL'
            }. Expected balance: ${expectedBalance}. Actual balance on app UI: ${accountBalance}`,
          });
          jestExpect(accountBalance).toEqual(expectedBalance);
        }
      } catch (error) {
        log.info(`
             You did something wrong dummy!
             ${error}
           `);
        throw error;
      }
    });
    it('Verify Card Transaction functionality', async () => {
      try {
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
        await dashboardPage.tapCardsBtn();
        const last4digit = await cardPage.verifyCardLast4Digits(attributes);
        await addMsg({
          message: `Verify Card last 4 digit :${
            last4digit.actualCardLast4 === last4digit.expCardLast4
              ? 'PASS'
              : 'FAIL'
          }. Expected Card last 4 digit from Backend: ${
            last4digit.expCardLast4
          }. Actual Card last 4 digit on app UI: ${last4digit.actualCardLast4}`,
        });
        jestExpect(last4digit.actualCardLast4).toEqual(last4digit.expCardLast4);
        await getCardTransaction(last4digit.cardID, last4digit.actualCardLast4);

        await cardPage.tabSeeAll();
        await transactionHistoryPage.tabFilterBtn();
        await transactionHistoryPage.tabCardPurchaseBtn();

        let cardTransactionSubtitle = await cardPage.verifyCardSubtitle();
        await addMsg({
          message: `Verify Card Transaction title in Card page:${
            cardTransactionSubtitle === 'Card Purchase' ? 'PASS' : 'FAIL'
          }. Expected Card Transaction title: 'Card Purchase'. Actual Card Transaction title on app UI: ${cardTransactionSubtitle}`,
        });
        jestExpect(cardTransactionSubtitle).toEqual('Card Purchase');

        const cardDetails = await getCardTransationHistory(
          token,
          defaultAccount,
          last4digit.cardID,
        );

        let cardTransactionTime = await cardPage.verifyCardTime(
          cardDetails.data[0].createdAt,
        );
        await addMsg({
          message: `Verify Card Transaction time in Card page:${
            cardTransactionTime.actualTime === cardTransactionTime.formattedTime
              ? 'PASS'
              : 'FAIL'
          }. Expected Card Transaction time from Backend: ${
            cardTransactionTime.formattedTime
          }. Actual Card Transaction time on app UI: ${
            cardTransactionTime.actualTime
          }`,
        });
        jestExpect(cardTransactionTime.actualTime).toEqual(
          cardTransactionTime.formattedTime,
        );

        let cardTransactionStatus =
          await transactionHistoryPage.verifyCardStatus();
        let expStatus = firstUpperRestLower(cardDetails.data[0].status);
        await addMsg({
          message: `Verify Card Transaction status in Transaction History page:${
            cardTransactionStatus === expStatus ? 'PASS' : 'FAIL'
          }. Expected Card Transaction status from Backend: ${expStatus}. Actual Card Transaction status on app UI: ${cardTransactionStatus}`,
        });
        jestExpect(cardTransactionStatus).toEqual(expStatus);

        let cardTransactionDesc = await transactionHistoryPage.verifyCardDesc();
        await addMsg({
          message: `Verify Card Transaction description in Transaction History page:${
            cardTransactionDesc === cardDetails.data[0].description
              ? 'PASS'
              : 'FAIL'
          }. Expected Card Transaction description from Backend: ${
            cardDetails.data[0].description
          }. Actual Card Transaction description on app UI: ${cardTransactionDesc}`,
        });
        jestExpect(cardTransactionDesc).toEqual(
          cardDetails.data[0].description,
        );

        let cardTransactionAmount =
          await transactionHistoryPage.verifyCardAmount();
        let expectedAmt = amountToStringWithSubunits(
          cardDetails.data[0].amountTo,
          cardDetails.data[0].currencyFrom as Currency,
        );
        expectedAmt = '-' + expectedAmt;
        await addMsg({
          message: `Verify Card Transaction Amount in Transaction History page:${
            cardTransactionAmount === expectedAmt ? 'PASS' : 'FAIL'
          }.
          Expected Card Transaction Amount from Backend: ${expectedAmt}. Actual Card Transaction Amount on app UI: ${cardTransactionAmount}`,
        });
        jestExpect(cardTransactionAmount).toEqual(expectedAmt);
        await cardPage.tapCardStatus();

        const cardTransDetail =
          await transactionDetailPage.verifyCardPurchaseTransactionDetails();
        await addMsg({
          message: `Verify Card Transaction title in Transaction Detail page:${
            cardTransDetail.actualTitleName === 'Card Purchase'
              ? 'PASS'
              : 'FAIL'
          }. Expected Card Transaction title: 'Card Purchase'. Actual Card Transaction title on app UI: ${
            cardTransDetail.actualTitleName
          }`,
        });
        jestExpect(cardTransDetail.actualTitleName).toEqual(
          cardTransactionSubtitle,
        );

        await addMsg({
          message: `Verify Card Transaction status in Transaction Detail page:${
            cardTransDetail.actualStatus === expStatus ? 'PASS' : 'FAIL'
          }. Expected Card Transaction status from Backend: ${expStatus}. Actual Card Transaction status on app UI: ${
            cardTransDetail.actualStatus
          }`,
        });
        jestExpect(cardTransDetail.actualStatus).toEqual(expStatus);

        await addMsg({
          message: `Verify Card Transaction Amount in Transaction Detail page:${
            cardTransDetail.actualAmt === expectedAmt ? 'PASS' : 'FAIL'
          }.
          Expected Card Transaction Amount from Backend: ${expectedAmt}. Actual Card Transaction Amount on app UI: ${
            cardTransDetail.actualAmt
          }`,
        });
        jestExpect(cardTransDetail.actualAmt).toEqual(expectedAmt);

        await addMsg({
          message: `Verify Card Transaction description in Transaction Detail page:${
            cardTransDetail.actualDesc === cardDetails.data[0].description
              ? 'PASS'
              : 'FAIL'
          }. Expected Card Transaction description from Backend: ${
            cardDetails.data[0].description
          }. Actual Card Transaction description on app UI: ${
            cardTransDetail.actualDesc
          }`,
        });
        jestExpect(cardTransDetail.actualDesc).toEqual(
          cardDetails.data[0].description,
        );

        await addMsg({
          message: `Verify Card Transaction Category in Transaction Detail Card page:${
            cardTransDetail.actualCategory === 'Card Purchase' ? 'PASS' : 'FAIL'
          }. Expected Card Transaction Category: 'Card Purchase'. Actual Card Transaction title on app UI: ${
            cardTransDetail.actualCategory
          }`,
        });
        jestExpect(cardTransactionSubtitle).toEqual('Card Purchase');

        await transactionDetailPage.tapBackBtn();
        await transactionHistoryPage.tapBackBtn();
        await dashboardPage.tapCardsBtn();

        cardTransactionSubtitle = await cardPage.verifyCardSubtitle();
        await addMsg({
          message: `Verify Card Transaction title in Card page:${
            cardTransactionSubtitle === 'Card Purchase' ? 'PASS' : 'FAIL'
          }. Expected Card Transaction title: 'Card Purchase'. Actual Card Transaction title on app UI: ${cardTransactionSubtitle}`,
        });
        jestExpect(cardTransactionSubtitle).toEqual('Card Purchase');

        cardTransactionTime = await cardPage.verifyCardTime(
          cardDetails.data[0].createdAt,
        );
        await addMsg({
          message: `Verify Card Transaction time in Card page:${
            cardTransactionTime.actualTime === cardTransactionTime.formattedTime
              ? 'PASS'
              : 'FAIL'
          }. Expected Card Transaction time from Backend: ${
            cardTransactionTime.formattedTime
          }. Actual Card Transaction time on app UI: ${
            cardTransactionTime.actualTime
          }`,
        });
        jestExpect(cardTransactionTime.actualTime).toEqual(
          cardTransactionTime.formattedTime,
        );

        cardTransactionStatus = await cardPage.verifyCardStatus();
        expStatus = firstUpperRestLower(cardDetails.data[0].status);
        await addMsg({
          message: `Verify Card Transaction status in Card page:${
            cardTransactionStatus === expStatus ? 'PASS' : 'FAIL'
          }. Expected Card Transaction status from Backend: ${expStatus}. Actual Card Transaction status on app UI: ${cardTransactionStatus}`,
        });
        jestExpect(cardTransactionStatus).toEqual(expStatus);

        cardTransactionDesc = await cardPage.verifyCardDesc();
        await addMsg({
          message: `Verify Card Transaction description in Card page:${
            cardTransactionDesc === cardDetails.data[0].description
              ? 'PASS'
              : 'FAIL'
          }. Expected Card Transaction description from Backend: ${
            cardDetails.data[0].description
          }. Actual Card Transaction description on app UI: ${cardTransactionDesc}`,
        });
        jestExpect(cardTransactionDesc).toEqual(
          cardDetails.data[0].description,
        );

        cardTransactionAmount = await cardPage.verifyCardAmount();
        expectedAmt = amountToStringWithSubunits(
          cardDetails.data[0].amountTo,
          cardDetails.data[0].currencyFrom as Currency,
        );
        expectedAmt = '-' + expectedAmt;
        await addMsg({
          message: `Verify Card Transaction Amount in Card page:${
            cardTransactionAmount === expectedAmt ? 'PASS' : 'FAIL'
          }.
          Expected Card Transaction Amount from Backend: ${expectedAmt}. Actual Card Transaction Amount on app UI: ${cardTransactionAmount}`,
        });
        jestExpect(cardTransactionAmount).toEqual(expectedAmt);
      } catch (error) {
        log.info(`
             You did something wrong dummy!
             ${error}
           `);
        throw error;
      }
    });

    afterEach(async () => {
      await attachDeviceScreenShotToReport('Screenshot', 'Test End');
    });

    afterAll(async () => {
      device.terminateApp();
    });
  },
);
