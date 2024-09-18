import dayjs from 'dayjs';
import { log } from 'detox';
import { addAttach, addMsg } from 'jest-html-reporters/helper';

import {
  Account,
  AccountBalance,
  Charge,
  Currency,
} from '../../src/types/commons';
import { currencyDecimals } from '../../src/utils/amount';

const { exec } = require('child_process');

const fs = require('fs');
const globalAny: any = global;

export async function startMockServer() {
  await exec('yarn mockserver', (err: any, stdout: any, stderr: any) => {
    log.info('🚀 ⏳ server started completed - ', err, stdout, stderr);
  });
}

export async function stopMockServer() {
  await exec('lsof -i :3000', async (err: any, stdout: any, stderr: any) => {
    log.info('list of process for port 3000 ', err, stdout, stderr);
    const stdoutArray = stdout.split('\n');
    log.info('PID', stdoutArray);
    await stdoutArray.forEach(async (std: any) => {
      log.info('std **', std);
      if (std.includes('LISTEN')) {
        const regex = /[0-9]+/;
        const matches = std.match(regex);
        log.info('PID **', matches?.[0]);
        await exec(
          'kill -9 ' + matches?.[0],
          (err: any, stdout: any, stderr: any) => {
            log.info(
              '🚫 🟥 ⌛ Stopped Server at port 3000 ',
              err,
              stdout,
              stderr,
            );
          },
        );
      }
    });
  });
}
export function moveAndRename(
  sourceDir: string,
  screenShotName: string,
  screenShotPath: string,
) {
  log.info('moveAndRename', screenShotPath, __dirname);
  fs.copyFile(
    sourceDir,
    `${screenShotPath}/${screenShotName}.png`,
    (err: any) => {
      if (err) throw err;
      log.info('File was copied to destination');
    },
  );
  return `${screenShotPath}/${screenShotName}.png`;
  //return path.resolve(__dirname, `../screenshots/${screenShotName}.png`);
}

export async function printDeviceInformation(
  device: Detox.DetoxExportWrapper['device'],
) {
  log.info(
    '***** Device Info: Id=%o, Name=%o,  OS=%o*******',
    device.id,
    device.name,
    device.getPlatform(),
  );
  return {
    Id: device.id,
    Name: device.name,
    OS: device.getPlatform(),
  };
}

export async function addCustomLogToReporter(toLog: string) {
  log.info('** addCustomLogToReporter **\n', toLog);
  await addMsg({ message: toLog, context: null });
}

export async function attachDeviceScreenShotToReport(
  screenShotName: string,
  description: string,
) {
  const tmpScreenshotPath = await device.takeScreenshot(screenShotName);
  const currentDate = new Date();
  const dynamicScreenshotName =
    screenShotName +
    '-' +
    currentDate.getHours() +
    '.' +
    currentDate.getMinutes() +
    '.' +
    currentDate.getSeconds();
  await moveAndRename(
    tmpScreenshotPath,
    dynamicScreenshotName,
    `${process.env.PWD}${globalAny?.screenShotPath}`,
  );
  await addAttach({
    attach: `${dynamicScreenshotName}.png`,
    description: description,
  });
}

export async function handleTestEvent(event: any, state: any) {
  if (event.name === 'test_fn_failure') {
    const testDescription = state.currentlyRunningTest.parent.name;
    const testName = state.currentlyRunningTest.name;
    // await fse.ensureDir('e2e/screenshots')
    // await this.global.page.screenshot({
    //   path: 'e2e/screenshots/' + toFilename(`${testDescription}-${testName}.png`),
    //   fullPage: true
    // })
    await attachDeviceScreenShotToReport('testName', 'Failure screenshot');
  }
}

export const getDefaultBalance = (
  accounts: [Account],
  accountName = 'default',
  currency: Currency,
): AccountBalance => {
  log.info('getDefaultBalance', accounts);
  const foundedBalances = accounts.find(account => account.name === accountName)
    ?.balances?.data;

  log.info('foundedBalances', foundedBalances);
  if (foundedBalances) {
    const foundedBalance =
      foundedBalances?.find(balance => balance.currency === currency) ||
      foundedBalances[0];
    return foundedBalance;
  }
  log.info('foundedBalances', foundedBalances);
  return { currency: Currency.AED, amount: 0, amountStr: '0' };
};

export const getDefaultAccount = (
  accounts: [Account],
  accountName = 'default',
): string => {
  log.info('getDefaultAccount', accounts);
  const foundedAccount: any = accounts.find(
    account => account.name === accountName,
  );
  log.info('foundedAccount', foundedAccount.accountId);
  return foundedAccount.accountId;
};

export const calculateFees = (charge: Charge, amount: number): number => {
  const BIPS = 100;

  let totalFees = 0;
  const { fixed, variable } = charge;
  log.info('fixed|variable|amount', amount, fixed, variable);
  if (fixed) {
    totalFees += fixed;
  }

  if (variable) {
    totalFees += (variable * amount) / BIPS;
  }

  return totalFees;
};

export const calculateTotalAmount = (
  formattedFees: number,
  formattedAmount: number,
  currency: Currency,
): string => {
  log.info('formattedAmount|formattedFees', formattedAmount, formattedFees);
  const total = formattedAmount + formattedFees;
  return total.toFixed(currencyDecimals(currency)).toString();
};

export const firstUpperRestLower = (string: string) => {
  return string.charAt(0).toUpperCase() + string?.slice(1).toLowerCase();
};

export const getTime = (createdAt: string) => {
  const time = `${dayjs(createdAt).format('HH:mm')}`;
  return time;
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
