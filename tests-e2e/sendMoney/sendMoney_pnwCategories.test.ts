//import { expect as jestExpect } from '@jest/globals';
import { device, log } from 'detox';

import { Category, Currency } from '../../../src/types/commons';
import { amountToStringWithSubunits } from '../../../src/utils/amount';
//import data from '../data/sendMoney/pnwCategories.json';
import DashboardPage from '../../pages/DashboardPage';
import LoginPage from '../../pages/LoginPage';
import {
  getAccount,
  getToken,
  getUsername,
  sendMoneyCategories,
} from '../../utils/graphQL';
import {
  attachDeviceScreenShotToReport,
  getDefaultAccount,
  getDefaultBalance,
} from '../../utils/helper';
import { JestType, jestExpect } from '../../utils/jestExpect';

const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/sendMoney/pnwCategories.json`);

describe.each(data)(
  'Test PnwCategories from $country with phoneNumber:$phoneNumber',
  ({ country, countryCode, phoneNumber, passcode, senderCurrency }) => {
    log.info(
      '*** Describe dataSet for ***',
      country,
      countryCode,
      phoneNumber,
      passcode,
      senderCurrency,
    );
    const dashboardPage = new DashboardPage();
    let categories: Category[] | null = null;

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

      const username = await getUsername(`${countryCode}${phoneNumber}`);
      log.info('username', username);

      const token = await getToken(
        username,
        `${countryCode}${phoneNumber}`,
        passcode,
      );
      const accounts = await getAccount(username, token);
      const defaultAccount = await getDefaultAccount(accounts);
      const balance = getDefaultBalance(
        accounts,
        'default',
        senderCurrency as Currency,
      );
      log.info('default balance *** ', balance);
      const formattedBalance = amountToStringWithSubunits(
        balance.amount,
        balance.currency as Currency,
      );
      log.info('formattedBalance *** ', formattedBalance);

      categories = await sendMoneyCategories(token, defaultAccount);
      await addMsg({
        message: `Categories for ${phoneNumber}: ${JSON.stringify(categories)}`,
      });
    });

    it('Verify Login Feature', async () => {
      log.info('should login ****', country, phoneNumber, passcode);
      const loginPage = new LoginPage();
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
    });

    it('Verify PNW Categories', async () => {
      await attachDeviceScreenShotToReport('dashboard', 'Senders dashboard');
      await dashboardPage.tapSendBtn();

      await attachDeviceScreenShotToReport(
        'categoryPage',
        'Senders Send PNW Category',
      );

      const isCategoryPageVisible =
        (await dashboardPage.expectToExist('coreText-Send money to')) ||
        (await dashboardPage.expectToBeVisible('coreText-Send money to'));
      //jestExpect(isCategoryPageVisible).toEqual(true);
      jestExpect(
        `isCategoryPageVisible: ${isCategoryPageVisible}`,
        isCategoryPageVisible,
        true,
        JestType.equals,
      );
      log.info('isCategoryPageVisible', isCategoryPageVisible);

      for (let i = 0; i < categories!.length; i++) {
        log.info('pnwCategoryName testId', categories?.[i].pnwCategoryName!);
        const categoryName = `coreText-${categories?.[i]
          .pnwCategoryName!}-mode-name`;
        const isCategoryVisible =
          (await dashboardPage.expectToExist(categoryName)) ||
          (await dashboardPage.expectToBeVisible(categoryName));
        log.info('isCategoryVisible', isCategoryVisible);
        const isActive = categories?.[i].status === 'ACTIVE' ? true : false;
        log.info('isActive', categories?.[i].status, isActive);
        //jestExpect(isCategoryVisible).toEqual(isActive);
        jestExpect(
          `isCategoryVisible ${categoryName}: ${isCategoryVisible}`,
          isCategoryVisible,
          isActive,
          JestType.equals,
        );
      }
    });

    afterAll(async () => {
      try {
        log.info('*** it afterAll ***');
      } catch (error) {
        log.error(`
          Script Failed !!!
         ${error}
        `);
        throw error;
      }
    });
  },
);
