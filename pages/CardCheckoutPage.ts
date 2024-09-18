import BasePage from './BasePage';

export default class CardCheckoutPage extends BasePage {
  get confirmBtn() {
    return element(by.text('Confirm'));
  }
  get modalConfirmBtn() {
    return element(by.id('modal-button-Confirm'));
  }

  async tapConfirmBtn() {
    await new Promise(resolve => setTimeout(resolve, 10000));
    const isConfirmBtnVisible = await this.expectToBeVisibleByElement(
      this.confirmBtn,
    );
    await this.confirmBtn.tap();
    return isConfirmBtnVisible;
  }
  async tapModalConfirmBtn() {
    let isConfirmBtnVisible = false;
    try {
      isConfirmBtnVisible = await this.expectToBeVisibleByElement(
        this.modalConfirmBtn,
      );
      await new Promise(resolve => setTimeout(resolve, 10000));
      await this.modalConfirmBtn.tap();
    } catch (error) {
      if (isConfirmBtnVisible) {
        await this.modalConfirmBtn.tap();
      }
    }
    return isConfirmBtnVisible;
  }
}
