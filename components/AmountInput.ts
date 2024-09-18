//var BasePage = require ('../pages/BasePage.js');
import { expect as jestExpect } from '@jest/globals';
import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import BasePage from '../pages/BasePage';
import { addCustomLogToReporter } from '../utils/helper';

export default class AmountInput extends BasePage {
  get amountInput() {
    return element(by.id(testIDs.AmountInput));
  }

  get amountInputRightDescriptionTop() {
    return element(by.id(`coreText-${testIDs.AmountRightDescriptionTop}`));
  }

  get amountInputRightDescriptionBottom() {
    return element(by.id(`coreText-${testIDs.AmountRightDescriptionBottom}`));
  }

  get amountInputLeftDescription() {
    return element(by.id(`coreText-${testIDs.AmountLeftDescription}`));
  }

  async enterAmount(amount: string) {
    await addCustomLogToReporter(
      JSON.stringify({
        'Entered Amount:': amount,
      }),
    );
    await this.amountInput.typeText(amount);
  }

  async assertAmountRightDescription(
    descriptionTop: string,
    descriptionBottom: string,
  ) {
    if (
      await this.expectToBeVisibleByElement(this.amountInputRightDescriptionTop)
    ) {
      const getAttributes: any =
        await this.amountInputRightDescriptionTop.getAttributes();
      log.info(
        'amountInputRightDescriptionTop|descriptionTop',
        getAttributes?.text,
        descriptionTop,
      );
      await addCustomLogToReporter(
        JSON.stringify({
          Expected: descriptionTop,
          'Actual Value': getAttributes?.text,
        }),
      );
      jestExpect(getAttributes?.text).toEqual(descriptionTop);
    } else {
      await addCustomLogToReporter(
        'amountInputRightDescriptionTop: NOT VISIBLE',
      );
    }

    if (
      await this.expectToBeVisibleByElement(
        this.amountInputRightDescriptionBottom,
      )
    ) {
      const getAttributes: any =
        await this.amountInputRightDescriptionBottom.getAttributes();
      log.info(
        'amountInputRightDescriptionBottom|descriptionBottom',
        getAttributes?.text,
        descriptionBottom,
      );
      await addCustomLogToReporter(
        JSON.stringify({
          Expected: descriptionBottom,
          'Actual Value': getAttributes?.text,
        }),
      );
      jestExpect(getAttributes?.text).toEqual(descriptionBottom);
    } else {
      await addCustomLogToReporter(
        'amountInputRightDescriptionBottom: NOT VISIBLE',
      );
    }
  }
  async assertAmountDescriptionById(
    descriptionID: string,
    description: string,
  ) {
    log.info(
      'assertAmountDescriptionById|descriptionID|description',
      descriptionID,
      description,
    );
    if (await this.expectToBeVisible(descriptionID)) {
      const getAttributes: any = await element(
        by.id(descriptionID),
      ).getAttributes();

      log.info(
        'assertAmountDescriptionById|getAttributes?.text|description',
        getAttributes?.text,
        description,
      );
      await addCustomLogToReporter(
        JSON.stringify({
          Expected: description,
          'Actual Value': getAttributes?.text,
        }),
      );
      jestExpect(getAttributes?.text).toEqual(description);
    }
  }
}
