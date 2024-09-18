import { device, log } from 'detox';

import { Currency, LoadMethod } from '../../../src/types/commons';
import { amountToStringWithSubunits } from '../../../src/utils/amount';
//import data from '../data/addMoney/debitCardLoadMethods.json';
import CheckoutAmountPage from '../../pages/CheckoutAmountPage';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import StripeCardDetailsPage from '../../pages/StripeCardDetailsPage';
import TopUpLoadChannelPage from '../../pages/TopUpLoadChannelPage';
import {
  getAccount,
  getToken,
  getUsername,
  listLoadMethodTypes,
} from '../../utils/graphQL';
import {
  attachDeviceScreenShotToReport,
  calculateFees,
  calculateTotalAmount,
  getDefaultAccount,
} from '../../utils/helper';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/addMoney/debitCardLoadMethods.json`);

describe.each(data)(
  'Test addMoney from $country with phoneNumber:$phoneNumber for amount $amount',
  ({
    deleteApp,
    country,
    countryCode,
    phoneNumber,
    passcode,
    amount,
    strip4digit,
    cardNumber,
    cardExpiry,
    cardCVV,
    currency,
    checkoutCardType,
    completedTitle,
    status,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      deleteApp,
      country,
      countryCode,
      phoneNumber,
      passcode,
      amount,
      strip4digit,
      cardNumber,
      cardExpiry,
      cardCVV,
      currency,
      checkoutCardType,
      completedTitle,
      status,
    );

    let debitCardLoadTypes: any[] = [];
    let youPayText = '';
    let feesText = '';
    let totalAmount = '';

    beforeAll(async () => {
      log.info('beforeAll');
      await device.launchApp({
        newInstance: true,
        delete: deleteApp,
        permissions: {
          location: 'always',
          notifications: 'YES',
          camera: 'YES',
          microphone: 'YES',
          contacts: 'YES',
          userTracking: 'YES',
        },
      });

      const username = await getUsername(`${countryCode}${phoneNumber}`);
      log.info('username **', username);

      const token = await getToken(
        username,
        `${countryCode}${phoneNumber}`,
        passcode,
      );

      const accounts = await getAccount(username, token);
      const defaultAccount = await getDefaultAccount(accounts);

      const loadMethodTypes: LoadMethod[] = await listLoadMethodTypes(
        token,
        defaultAccount,
        currency,
      );
      log.info('loadMethodTypes **', loadMethodTypes);
      debitCardLoadTypes = loadMethodTypes;
    });

    beforeEach(async () => {
      // await device.installApp();
      log.info('beforeEach');
    });

    describe('Test LoadMoney for Debit Card Option', () => {
      const dashboardPage = new DashboardPage();
      beforeAll(async () => {
        log.info('beforeAll ****');
      });

      beforeEach(async () => {
        // await device.installApp();
        await device.launchApp({
          newInstance: true,
        });
        log.info('beforeEach ****');
      });

      // it('dummy', () => {});

      it.each([
        { loadMethodName: 'CHECKOUT_DEBIT_CARD' },
        { loadMethodName: 'STRIPE_DEBIT_CARD' },
      ])('Test $loadMethodName', async ({ loadMethodName }) => {
        log.info('Load ***', loadMethodName);
        log.info('LOAD METHODS ** ', debitCardLoadTypes);

        const matchedLoadType = debitCardLoadTypes.find(load => {
          return load.loadMethodName === loadMethodName;
        });

        const loginPage = new LoginPage();
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);

        log.info('matchedLoad ** ', JSON.stringify(matchedLoadType));
        if (matchedLoadType) {
          const fees = matchedLoadType.loadMethodFees.find((fee: any) => {
            return fee.name === 'Load from Foreign Payment Card';
          });
          log.info('fees ** ', fees);

          const localCardfees = {
            fixed: fees?.amount?.fixed,
            variable: fees?.amount?.bips,
          };

          log.info('localCardfees ** ', localCardfees);
          const totalFees = calculateFees(localCardfees, amount);
          log.info('totalFees ** ', totalFees);

          const formattedFees = amountToStringWithSubunits(
            totalFees,
            currency as Currency,
            false,
          );
          log.info('formattedFees ** ', formattedFees);
          await addMsg({
            message: `Total formattedFees:${formattedFees}`,
          });

          feesText =
            currency === 'AED'
              ? `Fee (incl.VAT): ${currency} ${formattedFees}`
              : `Fee: ${currency} ${formattedFees}`;
          log.info('feesText ** ', feesText);
          await addMsg({
            message: `FeesText:${feesText}`,
          });

          totalAmount = calculateTotalAmount(
            Number(formattedFees),
            amount,
            currency as Currency,
          );
          log.info('totalAmount ** ', totalAmount);
          youPayText = `You will pay ${currency} ${totalAmount}`;
          log.info('youPayText ** ', youPayText);
          await addMsg({
            message: `YouPayText :${youPayText}`,
          });
          /////////////

          const topUpLoadChannelPage = new TopUpLoadChannelPage();
          const isTopUpBtnVisible: boolean = await dashboardPage.tapTopUpBtn();
          if (loadMethodName === 'STRIPE_DEBIT_CARD') {
            log.info('Test Stripe for ** ', phoneNumber);
            const stripeCardDetailsPage = new StripeCardDetailsPage();
            const topUpLoadChannelPage = new TopUpLoadChannelPage();
            await topUpLoadChannelPage.tapSavedDebitCard(strip4digit);
            await stripeCardDetailsPage.enterAmount(`${amount}`);
            await attachDeviceScreenShotToReport(
              `${phoneNumber}-${loadMethodName}`,
              'Stripe Validation',
            );
            await stripeCardDetailsPage.verifyRightDescription(
              feesText,
              youPayText,
            );

            await stripeCardDetailsPage.tapTopUpBtn();
          } else {
            log.info('Test checkout for ** ', phoneNumber);
            const isdebitCardBtnVisible =
              await topUpLoadChannelPage.tapDebitCardChannel();

            await addMsg({
              message: `Tap on Debit Card: ${
                isdebitCardBtnVisible ? 'PASS' : 'FAIL'
              }. Expected: Is Debit Card option visible? ${isdebitCardBtnVisible}`,
            });

            await topUpLoadChannelPage.tapLoadPaymentMethod(loadMethodName);
            const checkoutAmountPage = new CheckoutAmountPage();
            await checkoutAmountPage.enterAmount(`${amount}`);
            await attachDeviceScreenShotToReport(
              `${phoneNumber}-${loadMethodName}`,
              'Checkout Validation',
            );
            await checkoutAmountPage.enterCardDetails(
              cardNumber,
              cardExpiry,
              cardCVV,
            );
            // await checkoutAmountPage.verifyRightDescription(
            //   feesText,
            //   youPayText,
            // );

            await checkoutAmountPage.checkoutFlow(
              cardNumber,
              cardExpiry,
              cardCVV,
            );

            await attachDeviceScreenShotToReport(
              `${phoneNumber}-CheckoutCompletedStatus`,
              'Checkout Completed Status',
            );

            await checkoutAmountPage.verifyCheckoutCompletedStatus(
              completedTitle,
              status,
              `${currency} ${amount}.00`,
            );

            await checkoutAmountPage.tapCloseBtn();
          }
        } else {
          log.info(
            `No matched Load Method:${loadMethodName} from backend to assert`,
          );
          await addMsg({
            message: `No Matched Load Method:${loadMethodName} from backend to assert`,
          });
        }
      });
    });

    afterEach(async () => {
      log.info('afterEach');
    });

    afterAll(async () => {
      log.info('afterAll');
    });
  },
);
