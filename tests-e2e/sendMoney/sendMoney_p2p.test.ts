import { expect as jestExpect } from '@jest/globals';
import { device, log } from 'detox';

import { testIDs } from '../../../src/testIds/testId';
import { Currency } from '../../../src/types/commons';
import { amountToStringWithSubunits } from '../../../src/utils/amount';
//import data from '../data/sendMoney/sendMoneyP2P.json';
import CountryCodeBottomSheetPage from '../../pages/CountryCodeBottomSheetPage';
import DashboardPage from '../../pages/DashboardPage';
import HomeMenu from '../../pages/HomeMenu';
import LoginPage from '../../pages/LoginPage';
import PhoneNumberInputPage from '../../pages/PhoneNumberInputPage';
import SendMoneyAmountPage from '../../pages/SendMoneyAmountPage';
import SendMoneyConfirmationPage from '../../pages/SendMoneyConfirmationPage';
import SendMoneySuccessPage from '../../pages/SendMoneySuccessPage';
import { getAccount, getToken, getUsername } from '../../utils/graphQL';
import {
  attachDeviceScreenShotToReport,
  getDefaultAccount,
  getDefaultBalance,
} from '../../utils/helper';

const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/sendMoney/sendMoneyP2P.json`);

describe.each(data)(
  "Test: $route feature using data - '$country' with senderNumber:'$phoneNumber' to country '$receiverCountry' with  receiverNumber:'$receiver' for amount '$senderCurrency $amount'",
  ({
    country,
    senderCountryCode,
    receiverCountryCode,
    phoneNumber,
    passcode,
    receiver,
    amount,
    senderCurrency,
    receiverCurrency,
    route,
    receiverCountry,
    logout,
    testType,
    newInstance,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      country,
      senderCountryCode,
      receiverCountryCode,
      phoneNumber,
      passcode,
      receiver,
      amount,
      route,
      receiverCountry,
      testType,
      newInstance,
      senderCurrency,
      receiverCurrency,
    );
    const dashboardPage = new DashboardPage();
    const countryCodeBottomSheet = new CountryCodeBottomSheetPage();
    const sendMoneyAmountPage = new SendMoneyAmountPage();
    const sendMoneyConfirmationPage = new SendMoneyConfirmationPage();
    const sendMoneySuccessPage = new SendMoneySuccessPage();
    const loginPage = new LoginPage();
    const phoneNumberPage = new PhoneNumberInputPage();
    let username: string | '';
    let token: string | '';
    let formattedBalance = '';

    beforeAll(async () => {
      log.info(
        '*****  beforeAll CUSTOM LAUNCH ARGS *******',
        device.appLaunchArgs.get(),
      );
      log.info(
        '***** beforeAll CUSTOM LAUNCH SHARED ARGS *******',
        device.appLaunchArgs.shared.get(),
      );

      await device.launchApp({
        newInstance: true,
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
      const phoneNumberWithCode = senderCountryCode + phoneNumber;
      username = await getUsername(phoneNumberWithCode);
      log.info('username', username);
      token = await getToken(username, phoneNumberWithCode, passcode);
      const accounts = await getAccount(username, token);

      const defaultAccount = await getDefaultAccount(accounts);
      const balance = getDefaultBalance(
        accounts,
        'default',
        senderCurrency as unknown as Currency,
      );
      log.info('default balance *** ', balance);
      formattedBalance = amountToStringWithSubunits(
        balance.amount,
        balance.currency as Currency,
      );
      log.info('formattedBalance *** ', formattedBalance);
    });

    it('Verify Login Feature', async () => {
      log.info('should login ****', country, phoneNumber, passcode);
      const loginPage = new LoginPage();
      await loginPage.loginFlow(
        country,
        senderCountryCode,
        phoneNumber,
        passcode,
      );
    });

    it('Verify P2P Send Money Flow', async () => {
      await attachDeviceScreenShotToReport('dashboard', 'Senders dashboard');
      const getAccountBalance = await dashboardPage.verifyAccountBalance();
      jestExpect(getAccountBalance).toEqual(formattedBalance);
      await addMsg({
        message: `Verify the Account Balance of the user in Dashboard page: ${getAccountBalance === formattedBalance ? 'PASS' : 'FAIL'
          }. Expected balance fetch from backend: ${formattedBalance}. Actual balance on app UI: ${getAccountBalance}`,
      });
      await dashboardPage.tapSendBtn();
      await addMsg({ message: `Click on the Route: ${route}` });
      await dashboardPage.clickById(`coreText-${route}-mode-name`);
      await countryCodeBottomSheet.selectCountry(receiverCountry);
      await phoneNumberPage.enterNumber(receiver);
      await attachDeviceScreenShotToReport(
        'receiver_phonenumber',
        'Receiver Phonenumber',
      );
      await countryCodeBottomSheet.tapContinueBtn();
      let actualReceiverNumber = await sendMoneyAmountPage.verifyReceiver();
      jestExpect(actualReceiverNumber).toEqual(receiverCountryCode + receiver);
      await addMsg({
        message: `Verify Receiver before sending money: ${actualReceiverNumber === receiverCountryCode + receiver
          ? 'PASS'
          : 'FAIL'
          }. Expected receiver number: ${receiverCountryCode + receiver
          }. Actual receiver number on app UI: ${actualReceiverNumber}`,
      });
      const inlineErrors = await sendMoneyAmountPage.verifyInlineError(
        senderCurrency,
      );
      jestExpect(inlineErrors[0]).toEqual(inlineErrors[1]);
      await addMsg({
        message: `Verify Inline error in amount field:${inlineErrors[0] === inlineErrors[1] ? 'PASS' : 'FAIL'
          }. Expected Inline error message : ${inlineErrors[0]
          }. Actual Inline error message on app UI: ${inlineErrors[1]}`,
      });
      await sendMoneyAmountPage.enterAmount(amount);
      await attachDeviceScreenShotToReport(
        'amount',
        'Amount Details Send to Receiver',
      );
      await addMsg({ message: 'Tap on Next button' });
      await sendMoneyAmountPage.clickById('next');
      actualReceiverNumber = await sendMoneyConfirmationPage.verifyReceiver();
      jestExpect(actualReceiverNumber).toEqual(receiverCountryCode + receiver);
      await addMsg({
        message: `Verify Receiver before sending money: ${actualReceiverNumber === receiverCountryCode + receiver
          ? 'PASS'
          : 'FAIL'
          }. Expected receiver number: ${receiverCountryCode + receiver
          }. Actual receiver number on app UI: ${actualReceiverNumber}`,
      });
      const checkoutResults =
        await sendMoneyConfirmationPage.verifyCheckoutDetails(
          country,
          receiverCountry,
          amount,
          senderCurrency,
          receiverCurrency,
        );
      jestExpect(checkoutResults.actualYouSend).toEqual(
        checkoutResults.formattedSendAmount,
      );
      await addMsg({
        message: `Verify You Send amount :${checkoutResults.actualYouSend === checkoutResults.formattedSendAmount
          ? 'PASS'
          : 'FAIL'
          }. Expected You Send Amount: ${checkoutResults.formattedSendAmount
          }. Actual You Send Amount on app UI: ${checkoutResults.actualYouSend}`,
      });
      jestExpect(checkoutResults.actualFee).toEqual(
        checkoutResults.formattedFeeAmount,
      );
      await addMsg({
        message: `Verify Fee Amount:${checkoutResults.actualFee === checkoutResults.formattedFeeAmount
          ? 'PASS'
          : 'FAIL'
          }. Expected Fee Amount: ${checkoutResults.formattedFeeAmount
          }. Actual Fee Amount on app UI: ${checkoutResults.actualFee}`,
      });
      jestExpect(checkoutResults.actualTotal).toEqual(
        checkoutResults.formattedTotalAmount,
      );
      await addMsg({
        message: `Verify Total Amount:${checkoutResults.actualTotal === checkoutResults.formattedTotalAmount
          ? 'PASS'
          : 'FAIL'
          }. Expected Total Amount: ${checkoutResults.formattedTotalAmount
          }. Actual Total Amount on app UI: ${checkoutResults.actualTotal}`,
      });
      await sendMoneyConfirmationPage.tapNext();
      await sendMoneyConfirmationPage.wait(testIDs.BackHomeBtn, 7000);
      const transactionResult =
        await sendMoneySuccessPage.verifyTransactionStatus(
          country,
          receiverCountry,
        );
      jestExpect(transactionResult.actualStatus).toEqual(
        transactionResult.expectedStatus,
      );
      await addMsg({
        message: `Verify Transaction Status:${transactionResult.actualStatus === transactionResult.expectedStatus
          ? 'PASS'
          : 'FAIL'
          }. Expected Transaction Status: ${transactionResult.expectedStatus
          }. Actual Transaction Status on app UI: ${transactionResult.actualStatus
          }`,
      });
      await attachDeviceScreenShotToReport(
        'Send Money',
        'Transaction Acknowledgement Page',
      );
      await sendMoneySuccessPage.tapBackHome();
      await dashboardPage.isAccountBalanceVisible();
    });

    afterEach(async () => {
      // Check if the test step failed
      // const result = expect.getState().currentTestResult;
      const getState = await jestExpect.getState();
      log.info('STATE', getState);

      // if (result.status === 'failed') {
      //   // const screenshot = await device.takeScreenshot();
      //   // const base64Screenshot = `data:image/png;base64,${screenshot}`;
      //   // addAttach(base64Screenshot, 'Failure screenshot');

      // }
      await attachDeviceScreenShotToReport('Screenshot', 'Test end screenshot');
    });

    afterAll(async () => {
      try {
        log.info('*** it afterAll ***');
        if (logout === false) {
          log.info('*** it afterAll logout ***');
          return;
        }

        await dashboardPage.tapProfileBtn();
        const homeMenu = new HomeMenu();
        await homeMenu.logOut();
      } catch (error) {
        log.info(`
          You did something wrong dummy!
         ${error}
        `);
        throw error;
      }
    });
  },
);
