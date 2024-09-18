import { log } from 'detox';
//"545269990",
//import { formattedTestId } from '../../src/utils/formatTestIds';
//import data from '../data/sendMoney/sendMoneyErrorModal.json';
import CountryCodeBottomSheetPage from '../../pages/CountryCodeBottomSheetPage';
import DashboardPage from '../../pages/DashboardPage';
import HomeMenu from '../../pages/HomeMenu';
import LoginPage from '../../pages/LoginPage';
import PhoneNumberInputPage from '../../pages/PhoneNumberInputPage';
import SendMoneyErrorModalPage from '../../pages/SendMoneyErrorModalPage';
import {
  addCustomLogToReporter,
  attachDeviceScreenShotToReport,
  printDeviceInformation,
} from '../../utils/helper';

const { addAttach, addMsg } = require('jest-html-reporters/helper');
const globalAny: any = global;
const data: [
  any,
] = require(`../../data/${globalAny?.tester}/sendMoney/sendMoneyErrorModal.json`);

describe('SendMoney', () => {
  log.info('***** 6330 data *******', data);

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
  });

  describe.each(data)(
    'Test $testType from $country with phoneNumber:$phoneNumber to country $receiverCountry with  phoneNumber:$receiver for $route with $amount',
    ({
      country,
      senderCountryCode,
      phoneNumber,
      passcode,
      receiver,
      amount,
      route,
      receiverCountry,
      logout,
      testType,
      modalSubtitle,
      newInstance,
      modalTitle,
    }) => {
      log.info(
        '*** Describe dataSet for ***',
        country,
        senderCountryCode,
        phoneNumber,
        passcode,
        receiver,
        amount,
        route,
        receiverCountry,
        testType,
        newInstance,
        modalSubtitle,
        modalTitle,
      );

      const dashboardPage = new DashboardPage();
      const countryCodeBottomSheet = new CountryCodeBottomSheetPage();
      const loginPage = new LoginPage();
      const phoneNumberPage = new PhoneNumberInputPage();
      const sendMoneyErrorModalPage = new SendMoneyErrorModalPage();

      beforeAll(async () => {
        log.info('*** it beforeEach ***');
        await device.launchApp({
          newInstance: newInstance,
        });
      });

      it('Verify Login Feature', async () => {
        const loginPage = new LoginPage();
        await loginPage.loginFlow(
          country,
          senderCountryCode,
          phoneNumber,
          passcode,
        );
      });

      it('Send Money Flow', async () => {
        try {
          await dashboardPage.tapSendBtn();
          await addMsg({ message: `Click on the Route: ${route}` });
          await dashboardPage.clickById(`coreText-${route}-mode-name`);
          await countryCodeBottomSheet.selectCountry(receiverCountry);
          await phoneNumberPage.enterNumber(receiver);
          await attachDeviceScreenShotToReport(
            'Enter Number',
            'Receiver PhoneNumber',
          );
          await device.disableSynchronization();
          await countryCodeBottomSheet.tapContinueBtn();
          await new Promise(resolve => setTimeout(resolve, 10000));
          log.info('*** TestType ***', testType);
          await sendMoneyErrorModalPage.verifyErrorModal(
            testType,
            modalTitle,
            modalSubtitle,
          );
          await attachDeviceScreenShotToReport(
            `${testType}`,
            `Assertion for ${testType} user error modal`,
          );
          await device.enableSynchronization();
        } catch (error) {
          log.info(`
             You did something wrong dummy!
             ${error}
           `);
          throw error;
        }
      });

      afterAll(async () => {
        try {
          log.info('*** it afterAll ***');
          await attachDeviceScreenShotToReport(
            'Screenshot',
            'Test end screenshot',
          );
          if (logout === false) {
            log.info('*** it afterAll logout ***');
            return;
          }
          await dashboardPage.tapProfileBtn();
          const homeMenu = new HomeMenu();
          await homeMenu.logOut();
        } catch (error) {
          log.error(`
        You did something wrong dummy!
        ${error}`);
          throw error;
        }
      });
    },
  );

  afterAll(async () => {
    log.info('*** Final afterAll ***');
    device.terminateApp();
  });
});
