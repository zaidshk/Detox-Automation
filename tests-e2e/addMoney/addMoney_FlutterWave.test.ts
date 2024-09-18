import { log } from 'detox';

import { Currency, LoadMethod } from 'types/commons';

import { getFormattedRate } from 'utils/designSystem/amount';

import {
  amountToStringWithSubunits,
  roundAmountNumber,
} from '../../../src/utils/amount';
//import data from '../data/addMoney/flutterwave.json';
import DashboardPage from '../../pages/DashboardPage';
import FlutterwavePage from '../../pages/FlutterwavePage';
import LoginPage from '../../pages/LoginPage';
import TopUpLoadChannelPage from '../../pages/TopUpLoadChannelPage';
import {
  fetchUserAccountDetails,
  listLoadMethodTypes,
} from '../../utils/graphQL';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  calculateFees,
  printDeviceInformation,
} from '../../utils/helper';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/addMoney/flutterwave.json`);

describe.each(data)(
  'Test $loadMoneyType  for amount $amount $loadCurrency',
  ({
    country,
    countryCode,
    phoneNumber,
    passcode,
    amount,
    loadCurrency,
    loadMoneyType,
    logout,
    newInstance,
    paidCurrency,
  }) => {
    log.info(
      '*** Describe dataSet for Flutterwave ***',
      country,
      countryCode,
      phoneNumber,
      passcode,
      amount,
      loadCurrency,
      loadMoneyType,
      logout,
      newInstance,
      paidCurrency,
    );

    let debitCardLoadTypes: any[] = [];

    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        permissions: {
          location: 'always',
          notifications: 'YES',
          camera: 'YES',
          microphone: 'YES',
          contacts: 'YES',
          userTracking: 'YES',
        },
      });

      const info = await printDeviceInformation(device);
      await addCustomLogToReporter(JSON.stringify(info));

      const details = await fetchUserAccountDetails(
        countryCode,
        phoneNumber,
        passcode,
      );
      log.info('** details **\n', details);
      await addCustomLogToReporter(JSON.stringify(details));

      const loadMethodTypes: LoadMethod[] = await listLoadMethodTypes(
        details?.token,
        details?.defaultAccount,
        loadCurrency,
      );
      log.info('loadMethodTypes **', loadMethodTypes);
      debitCardLoadTypes = loadMethodTypes;
    });

    describe('Test LoadMoney for Flutterwave Option', () => {
      const dashboardPage = new DashboardPage();
      const flutterwavePage = new FlutterwavePage();

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

      it.each([{ loadMethodName: 'FLUTTERWAVE_MOBILE_MONEY_UG' }])(
        'Test $loadMethodName',
        async ({ loadMethodName }) => {
          const matchedLoadType = debitCardLoadTypes.find(load => {
            return load.loadMethodName === loadMethodName;
          });

          log.info('matchedLoadType **', matchedLoadType);

          const loadMethodFxRates = matchedLoadType.loadMethodFxRates;
          log.info('loadMethodFxRates **', loadMethodFxRates);
          const fxRates = loadMethodFxRates?.[0];
          const exchangedAmount = amount * fxRates?.rate;
          log.info('exchangedAmount **', exchangedAmount);

          const fees = matchedLoadType.loadMethodFees;
          log.info('fees **', fees);
          const localfees = {
            fixed: fees?.amount?.fixed || 0,
            variable: fees?.amount?.bips || 0,
          };

          log.info('localfees **', localfees);

          const totalFees = calculateFees(localfees, amount);
          log.info('totalFees ** ', totalFees);

          const totalAmount = exchangedAmount + fees;
          log.info('totalAmount **', totalAmount);

          const beforeFeesTxt = `Before fee: ${fxRates?.counter} ${(
            exchangedAmount - totalFees
          ).toFixed(2)}`;
          log.info('beforeFeesTxt **', beforeFeesTxt);

          //const feesText = `Fee: ${fxRates?.counter} ${totalFees}`;

          const feesText = `Fee: ${amountToStringWithSubunits(
            roundAmountNumber(totalFees),
            fxRates?.counter,
          )}`;

          log.info('feesText **', feesText);
          const rate = getFormattedRate(fxRates.rate);

          const leftDescriptionFeesText = `1 ${fxRates?.base} = ${rate} ${fxRates?.counter}`;
          log.info('leftDescriptionFeesText **', leftDescriptionFeesText);

          const loadLimit = matchedLoadType.loadLimits?.[0];
          log.info('loadLimit **', loadLimit);

          if (matchedLoadType) {
            const loginPage = new LoginPage();
            await loginPage.loginFlow(
              country,
              countryCode,
              phoneNumber,
              passcode,
            );
            const isTopUpBtnVisible: boolean =
              await dashboardPage.tapTopUpBtn();
            // await new Promise(resolve => setTimeout(resolve, 10000));

            // await dashboardPage.tapTopUpBtn();
            await addMsg({
              message: `Check visiblity of Top Up Button and Click on it: ${
                isTopUpBtnVisible ? 'PASS' : 'FAIL'
              }. Expected: Is Top Up button visible? ${isTopUpBtnVisible}`,
            });

            const topUpLoadChannelPage = new TopUpLoadChannelPage();
            const isMobileWalletdBtnVisible =
              await topUpLoadChannelPage.tapMobileWalletLoad(
                'LOAD#FLUTTERWAVE_MOBILE_MONEY_UG#1',
              );
            await addMsg({
              message: `Tap on Mobile Wallet: ${
                isMobileWalletdBtnVisible ? 'PASS' : 'FAIL'
              }. Expected: Is Mobile Wallet option visible? ${isMobileWalletdBtnVisible}`,
            });

            await topUpLoadChannelPage.clickById(loadMoneyType);

            //Test for Min and Max
            if (loadLimit) {
              await flutterwavePage.enterAmount('0');
              await attachDeviceScreenShotToReport(
                'FlutterwaveMin-Max',
                'Min/Max Validation',
              );

              const minAmountRequiredText = `Min ${amountToStringWithSubunits(
                loadLimit?.loadMinAmount,
                loadCurrency as Currency,
              )} required`;
              log.info('minAmountRequiredText **', minAmountRequiredText);

              const maxAmountAllowedText = `Max ${amountToStringWithSubunits(
                loadLimit?.loadLimitAmount,
                loadCurrency as Currency,
              )} allowed`;
              log.info('maxAmountAllowedText **', maxAmountAllowedText);

              await flutterwavePage.verifyDescription(
                'coreText-AmountRightDescriptionTop-youLoad',
                minAmountRequiredText,
              );

              await flutterwavePage.verifyDescription(
                'coreText-AmountRightDescriptionBottom-youLoad',
                maxAmountAllowedText,
              );
            }
            await flutterwavePage.clearText();
            await flutterwavePage.enterAmount(`${amount}`);
            await attachDeviceScreenShotToReport(
              'FlutterwaveCustomAmount',
              'Custom Amount Validation',
            );

            await flutterwavePage.verifyDescription(
              'coreText-AmountRightDescriptionTop-youPay',
              feesText,
            );

            await flutterwavePage.verifyDescription(
              '"coreText-AmountRightDescriptionBottom-youPay',
              beforeFeesTxt,
            );

            await flutterwavePage.verifyDescription(
              'coreText-AmountLeftDescription-youPay',
              leftDescriptionFeesText,
            );

            await flutterwavePage.tapTopUpBtn();
            await new Promise(resolve => setTimeout(resolve, 10000));
            await flutterwavePage.verifyFlutterwaveDialog();
          }
        },
      );
    });
    afterAll(async () => {
      try {
        log.info('*** it afterAll ***');
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
