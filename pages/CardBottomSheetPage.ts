import { expect as jestExpect } from '@jest/globals';
import { log } from 'detox';

import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class CardBottomSheetPage extends BasePage {
  get activatePhysicalCard() {
    return element(by.text('Activate physical card'));
  }

  get requestPhysicalCard() {
    return element(by.text('Request physical card'));
  }

  get requestVirtualCard() {
    return element(by.id('cardrequest-item-2'));
  }

  async tapActivatePhysicalCard() {
    await this.expectToBeVisibleByElement(this.activatePhysicalCard);
    await this.activatePhysicalCard.tap();
  }

  async tapRequestPhysicalCard() {
    await this.expectToBeVisibleByElement(this.requestPhysicalCard);
    await this.requestPhysicalCard.tap();
  }

  async tapRequestVirtualCard() {
    //const isRequestCardVisible: boolean = await this.expectToBeVisibleByElement(this.requestVirtualCard);
    await this.requestVirtualCard.tap();
    //  return isRequestCardVisible;
  }

  async verifyCardService(data: any, desiredFeatureNames: string[]) {
    let isRequestCardVisible = false;
    let isRequestPhysicalCardVisible = false;
    let isActivateCardVisible = false;
    let isRequestCardServiceAvailable = false;
    let isRequestPhysicalCardServiceAvailable = false;
    let isActivatePhysicalCardServiceAvailable = false;
    log.info('serviceData**', data);

    for (const desiredFeatureName of desiredFeatureNames) {
      const feature = data.find(
        (feature: any) => feature.serviceFeatureName === desiredFeatureName,
      );
      //      if (feature) {
      //   if (feature.serviceFeatureStatus === 'AVAILABLE') {
      if (feature.serviceFeatureName === 'VIRTUAL_CARD_REQUEST') {
        isRequestCardServiceAvailable =
          feature.serviceFeatureStatus === 'AVAILABLE' ? true : false;
        isRequestCardVisible = await this.expectToBeVisibleByElement(
          this.requestVirtualCard,
        );
        jestExpect(isRequestCardVisible).toEqual(isRequestCardServiceAvailable);
      } else if (feature.serviceFeatureName === 'PHYSICAL_CARD_REQUEST') {
        isRequestPhysicalCardServiceAvailable =
          feature.serviceFeatureStatus === 'AVAILABLE' ? true : false;
        isRequestPhysicalCardVisible = await this.expectToBeVisibleByElement(
          this.requestPhysicalCard,
        );
        jestExpect(isRequestPhysicalCardVisible).toEqual(
          isRequestPhysicalCardServiceAvailable,
        );
      } else if (feature.serviceFeatureName === 'PHYSICAL_CARD_ACTIVATE') {
        isActivatePhysicalCardServiceAvailable =
          feature.serviceFeatureStatus === 'AVAILABLE' ? true : false;
        isActivateCardVisible = await this.expectToBeVisibleByElement(
          this.activatePhysicalCard,
        );
        jestExpect(isActivateCardVisible).toEqual(
          isActivatePhysicalCardServiceAvailable,
        );
      }
    }
    return isRequestPhysicalCardServiceAvailable;
    // } else {
    //   jestExpect(
    //     `Service feature "${desiredFeatureName}" not found`,
    //   ).toBeTruthy();
    // }
  }
}
