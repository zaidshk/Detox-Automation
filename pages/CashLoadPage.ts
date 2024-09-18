import { log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import { JestType, jestExpect } from '../utils/jestExpect';
import BasePage from './BasePage';

export default class CashLoadPage extends BasePage {
  get nextBtn() {
    return element(by.id(testIDs.NextBtn));
  }

  async tapNextBtn() {
    return this.nextBtn.tap();
  }

  async tapCloseBtn() {
    return element(by.id(testIDs.CloseBtn)).tap();
  }

  async goToDetailPage() {
    return element(by.id('')).tap();
  }

  async getLoadProviderForDetailPage() {
    const getloadProviderAtt: any = await element(
      by.id('coreText-loadProvider'),
    ).getAttributes();
    const loadProviderText = getloadProviderAtt.text;
    return loadProviderText;
  }

  async getAddressForDetailPage() {
    const getAddressAtt: any = await element(
      by.id('coreText-addressLine1'),
    ).getAttributes();
    const addressText = getAddressAtt.text;
    return addressText;
  }

  async validateAllElementsVisible(elementsList: string[], exist = true) {
    for (const elementId of elementsList) {
      const getAtt: any = await element(by.id(elementId)).getAttributes();
      log.info('attributes **', getAtt);
      const attribute = getAtt?.elements ? getAtt.elements[0] : getAtt;
      const isVisible = attribute.visible;
      const assert = jestExpect(
        `Is ${elementId} exist/visible ${isVisible}`,
        exist,
        isVisible,
        JestType.equals,
      );
    }
  }
}
