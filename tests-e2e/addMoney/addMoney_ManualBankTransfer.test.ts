//import { expect as jestExpect } from '@jest/globals';
import { device, log } from 'detox';

import { testIDs } from '../../../src/testIds/testId';
import {
  Currency,
  DataAttribute,
  LoadMethod,
} from '../../../src/types/commons';
import { amountToStringWithSubunits } from '../../../src/utils/amount';
import lokaliseData from '../../../src/utils/lokalizeKeys.json';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import ManualBankTransferPage from '../../pages/ManualBankTransferPage';
import TopUpLoadChannelPage from '../../pages/TopUpLoadChannelPage';
import {
  fetchUserAccountDetails,
  getManualBankTransferDetails,
  listLoadMethodTypes,
} from '../../utils/graphQL';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  getDefaultBalance,
} from '../../utils/helper';
import { JestType, jestExpect } from '../../utils/jestExpect';

const globalAny: any = global;

//import data from '../data/addMoney/manualBankTransfer.json';
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/addMoney/manualBankTransfer.json`);

const { addAttach, addMsg } = require('jest-html-reporters/helper');

describe.each(data)(
  'Manual Bank Transfer for $country with phoneNumber:$phoneNumber for amount $amount $currency',
  ({
    country,
    countryCode,
    phoneNumber,
    passcode,
    amount,
    logout,
    name,
    currency,
    loadMethodName,
  }) => {
    log.info(
      '*** Describe dataSet for ***',
      country,
      countryCode,
      phoneNumber,
      passcode,
      amount,
      currency,
      loadMethodName,
    );

    let transactionId = '';
    let attributes: Array<DataAttribute | null> = [];
    let debitCardLoadTypes: any[] = [];
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

      const details = await fetchUserAccountDetails(
        countryCode,
        phoneNumber,
        passcode,
      );
      //const accounts = await getAccount(username, token);

      const balance = getDefaultBalance(
        details?.accounts,
        'default',
        currency as Currency,
      );

      log.info('default balance *** ', balance);
      formattedBalance = amountToStringWithSubunits(
        balance.amount,
        balance.currency as Currency,
      );
      log.info('formattedBalance *** ', formattedBalance);

      const loadMethodTypes: LoadMethod[] = await listLoadMethodTypes(
        details?.token,
        details?.defaultAccount,
        currency,
      );
      log.info('loadMethodTypes **', loadMethodTypes);
      debitCardLoadTypes = loadMethodTypes;

      attributes = await getManualBankTransferDetails(details?.token, name);
      log.info('Bank Detail Attributes **', attributes);
    });

    describe('Manual Bank Transfer Start', () => {
      const dashboardPage = new DashboardPage();
      const manualBankPage = new ManualBankTransferPage();

      beforeAll(async () => {
        log.info('beforeAll ****');
      });

      beforeEach(async () => {
        await device.launchApp({
          newInstance: false,
        });
        log.info('beforeEach ****');
      });

      it('Verify Login Feature', async () => {
        const loginPage = new LoginPage();
        await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
      });

      it('Verify Manual Bank Transfer Flow', async () => {
        const matchedLoadType = debitCardLoadTypes.find(load => {
          return load.loadMethodName === loadMethodName;
        });

        log.info('matchedLoad ** ', JSON.stringify(matchedLoadType));
        if (matchedLoadType) {
          await dashboardPage.tapTopUpBtn();
          const topUpLoadChannelPage = new TopUpLoadChannelPage();
          await topUpLoadChannelPage.tapOnBankLoad();
          //Assertion that bank transafer option is available
          //Validate from backend call or from data set
          await manualBankPage.tapManualBankTransferOption();
          await manualBankPage.enterBankTransferAmount('0');

          await attachDeviceScreenShotToReport(
            `ManualMin-Max-${phoneNumber}`,
            'Min/Max Validation',
          );
          const loadLimit = matchedLoadType.loadLimits?.[0];
          log.info('loadLimit **', loadLimit);

          await manualBankPage.verifyDescription(
            'coreText-AmountLabel',
            currency,
          );

          await manualBankPage.verifyDescription(
            'coreText-AmountLeftDescription',
            `Balance: ${formattedBalance}`,
          );

          const minAmountRequiredText = `Min ${amountToStringWithSubunits(
            loadLimit?.loadMinAmount,
            currency as Currency,
          )} required`;
          log.info('minAmountRequiredText **', minAmountRequiredText);

          const maxAmountAllowedText = `Max ${amountToStringWithSubunits(
            loadLimit?.loadLimitAmount,
            currency as Currency,
          )} allowed`;
          log.info('maxAmountAllowedText **', maxAmountAllowedText);

          await manualBankPage.verifyDescription(
            'coreText-AmountRightDescriptionTop',
            minAmountRequiredText,
          );

          await manualBankPage.verifyDescription(
            'coreText-AmountRightDescriptionBottom',
            maxAmountAllowedText,
          );

          //Check for Max and Min
          await manualBankPage.clearText();
          await manualBankPage.enterBankTransferAmount(`${amount}`);
          //coreText-AmountLabel === currency
          //coreText-AmountLeftDescription == formattedBalance

          await manualBankPage.tapNextBtn();
        } else {
          log.info(
            `No matched Load Method:${loadMethodName} from backend to assert`,
          );
          await addMsg({
            message: `No Matched Load Method:${loadMethodName} from backend to assert`,
          });
        }
      });

      it('Verify Manual Bank Details', async () => {
        await attachDeviceScreenShotToReport(
          `${phoneNumber}-ManualBankDetails`,
          'Manual Bank Details',
        );

        for (let i = 0; i < attributes.length; i++) {
          log.info(
            'attributes.name |  attributes.value | By.id',
            attributes[i]!.attributeName,
            attributes[i]!.attributeValue,
            `${attributes[i]!.attributeName!}`,
          );
          if (!attributes[i]!.attributeValue?.length) break;
          //manualBankTransfer.details.
          try {
            const getAttributes: any = await element(
              by.id(`coreText-${attributes[i]!.attributeName!}`),
            ).getAttributes();
            log.info('getAttributes ****', getAttributes);
            // jestExpect(getAttributes.text).toEqual(
            //   attributes[i]!.attributeValue,
            // );
            jestExpect(
              `Check Element: coreText-${attributes[i]!.attributeName!}`,
              getAttributes.text,
              attributes[i]!.attributeValue,
              JestType.equals,
            );
          } catch (e) {
            log.error('Matcher Issue:', e);
            await addCustomLogToReporter(`'Matcher Issue: ${e}`);
          }
        }
      });

      it('Initiate Manual Bank Transfer', async () => {
        log.info(
          'Lokalise Data:',
          lokaliseData['scr.4420_pending_yourRequest_message.label'],
        );
        await manualBankPage.scrollToBottom('KeyboardAwareScrollView');
        transactionId = `${Math.floor(100000 + Math.random() * 900000)}`;
        log.info('transactionId', transactionId);
        await manualBankPage.enterTransactionId(`${transactionId}`);
        await device.disableSynchronization();
        await manualBankPage.tapNextBtn();
        await new Promise(resolve => setTimeout(resolve, 15000));
        log.info('transactionId', transactionId);

        await manualBankPage.verifyDescription('coreText-Title', 'Pending');

        // jestExpect(getAttributes.text).toEqual(
        //   lokaliseData['scr.4420_pending_yourRequest_message.label'],
        // );

        await manualBankPage.tapCloseBtn();
        await device.enableSynchronization();
      });

      it('Verify Manual Bank Transfer History', async () => {
        await dashboardPage.tapTopUpBtn();
        const topUpLoadChannelPage = new TopUpLoadChannelPage();
        await topUpLoadChannelPage.tapOnBankLoad();
        await manualBankPage.tapManualBankTransferHistoryOption();
        await manualBankPage.tapLastTransferRequest();

        const getReferenceAttributes: any = await element(
          by.id(`coreText-${testIDs.TransactionDetailValueReference}`),
        ).getAttributes();
        log.info('getReferenceAttributes', getReferenceAttributes);
        log.info('transactionId', transactionId);
        //jestExpect(getReferenceAttributes.text).toEqual(transactionId);
        jestExpect(
          `Check getReferenceAttributes: ${getReferenceAttributes.text}`,
          getReferenceAttributes.text,
          transactionId,
          JestType.equals,
        );
      });
    });

    afterEach(async () => {
      log.info('*** it afterEach ***');
      await attachDeviceScreenShotToReport('Screenshot', 'Test End');
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
