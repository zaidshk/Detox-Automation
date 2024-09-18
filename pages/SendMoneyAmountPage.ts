//var BasePage = require ('./BasePage.js');
//var BasePage = require ('./BasePage.js');
import { by, element, log } from 'detox';

import { testIDs } from '../../src/testIds/testId';
import BasePage from './BasePage';

const { addAttach, addMsg } = require('jest-html-reporters/helper');

export default class SendMoneyAmountPage extends BasePage {
  get amountInput() {
    return element(by.id(testIDs.SendMoneyAmountInput));
  }

  get nextBtn() {
    return element(by.id(testIDs.SendMoneyAmountInput));
  }

  get receiverPhoneNumber() {
    return element(by.id(testIDs.SendMoneyContactPhoneNumber));
  }

  get balanceAmount() {
    return element(by.id(testIDs.AmountCurrencyDropDown));
  }

  get minAmount() {
    return element(by.id(testIDs.MinimumAmountLabel));
  }

  get maxAmount() {
    return element(by.id(testIDs.MaximumAmountLabel));
  }
  get firstName() {
    return element(by.id(testIDs.BeneficiaryFirstName));
  }
  get lastName() {
    return element(by.id(testIDs.BeneficiaryLastName));
  }
  get phoneNumber() {
    return element(by.id(testIDs.BeneficiaryPhoneNumber));
  }
  async enterAmount(amount: string) {
    await this.amountInput.clearText();
    await addMsg({ message: `Enter the amount: ${amount}` });
    return this.amountInput.typeText(amount);
  }

  async enterRemittanceAmount(amount: string) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await element(by.id('amountFrom-amountCell-textInput')).clearText();
    await addMsg({ message: `Enter the Remittance amount: ${amount}` });
    // await element(by.id('amountFrom-amountCell-textInput')).typeText(amount);
    await this.waitAndTypeText('amountFrom-amountCell-textInput', `${amount}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await element(by.id('amountFrom-amountCell-textInput')).tapReturnKey();
  }

  async openCountrySelector() {
    await this.waitAndClickById('amountTo-country-touchable');
  }

  async searchCountry(country: string) {
    await this.waitAndTypeText(
      'amountTo-amountCell-countrySelector-corebottomsheet-searchbar-textinput',
      `${country}`,
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
    await element(
      by.id(
        'amountTo-amountCell-countrySelector-corebottomsheet-searchbar-textinput',
      ),
    ).tapReturnKey();
    // await this.waitAndClickById(`${country}-optionCellItem-touchable`);
    //await this.waitAndClickById(`${country}-optionCellItem-touchable`);
    await this.waitAndClickById(country);
  }

  async verifyReceiver() {
    const getAtt: any = await this.receiverPhoneNumber.getAttributes();
    const actualReceiverNumber = getAtt.text;
    return actualReceiverNumber;
  }

  async verifyInlineError(senderCurrency: string) {
    await this.enterAmount('0');
    let expectedInlineErr = '';
    if (senderCurrency === 'AED') expectedInlineErr = 'Min Amount:AED 1.00';
    else if (senderCurrency === 'KES')
      expectedInlineErr = 'Min Amount:KES 100.00';
    else if (senderCurrency === 'USD') expectedInlineErr = 'Min Amount:$5.00';

    const getAtt: any = await this.minAmount.getAttributes();
    const actualInlineErr = getAtt.text;
    const replacedString = actualInlineErr.replace(/\s/g, ' ');
    return [replacedString.trim(), expectedInlineErr.trim()];
  }

  async enterBenificiaryDetails(
    firstName: string,
    lastName: string,
    phoneNumber: string,
  ) {
    await this.firstName.typeText(firstName);
    await this.lastName.typeText(lastName);
    await this.phoneNumber.typeText(phoneNumber);
  }

  async fillBenificiaryFormForBankMode(
    documentNumber: string,
    accountNumber: string,
    ifscCode: string,
    mode: string,
  ) {
    await this.waitAndClickById('beneficiaryRelationshipToSender');
    await this.waitAndClickById('SELF');
    log.info('fillBenificiaryFormForBankMode', 'SELF');

    await this.waitAndClickById('beneficiaryIdentityDocumentType');
    await this.waitAndClickById('CUST');
    log.info('fillBenificiaryFormForBankMode', 'CUST');
    // await element(
    //   by.id('beneficiaryIdentityDocumentNumber-inputCell-value'),
    // ).typeText(documentNumber);

    await this.waitAndTypeText(
      'beneficiaryIdentityDocumentNumber-inputCell-value',
      documentNumber,
    );

    log.info('fillBenificiaryFormForBankMode', 'documentNumber');
    // await this.waitAndClickById('beneficiaryTargetInstitutionId');
    // await this.waitAndClickById('9100005-optionCellItem-touchable');

    await this.scrollToBottom('beneficiaryScreen-scrollview');

    // await await element(
    //   by.id('beneficiaryLocalAccountNumber-inputCell-value'),
    // ).typeText(accountNumber);

    if (mode === 'BANK') {
      await this.waitAndTypeText(
        'beneficiaryLocalAccountNumber-inputCell-value',
        accountNumber,
      );

      log.info('fillBenificiaryFormForBankMode', 'accountNumber');

      await this.scrollToBottom('beneficiaryScreen-scrollview');

      await this.waitAndTypeText(
        'beneficiaryTargetInstitutionBranchId-inputCell-value',
        ifscCode,
      );
      log.info('fillBenificiaryFormForBankMode', 'ifscCode');
    }

    // await element(
    //   by.id('beneficiaryTargetInstitutionBranchId-inputCell-value'),
    // ).typeText(ifscCode);

    await this.waitAndClickById('paymentPurposeCode');
    await this.waitAndClickById('DEPT');

    await this.scrollToBottom('beneficiaryScreen-scrollview');

    await this.waitAndClickById('senderSourceOfCash');
    await this.waitAndClickById('SELF');
  }

  // async fillBenificiaryFormForCashMode(documentNumber: string) {
  //   await this.waitAndClickById('beneficiaryRelationshipToSender');
  //   await this.waitAndClickById('SELF-optionCellItem-touchable');

  //   await this.waitAndClickById('beneficiaryIdentityDocumentType');
  //   await this.waitAndClickById('CUST-optionCellItem-touchable');

  //   await this.waitAndTypeText(
  //     'beneficiaryIdentityDocumentNumber-inputCell-value',
  //     documentNumber,
  //   );

  //   await this.waitAndClickById('paymentPurposeCode');
  //   await this.waitAndClickById('DEPT-optionCellItem-touchable');

  //   await this.waitAndClickById('senderSourceOfCash');
  //   await this.waitAndClickById('SELF-optionCellItem-touchable');
  // }

  // async fillBenificiaryFormForWalletMode(documentNumber: string) {
  //   await this.waitAndClickById('beneficiaryRelationshipToSender');
  //   await this.waitAndClickById('SELF-optionCellItem-touchable');

  //   await this.waitAndClickById('beneficiaryIdentityDocumentType');
  //   await this.waitAndClickById('CUST-optionCellItem-touchable');

  //   await this.waitAndTypeText(
  //     'beneficiaryIdentityDocumentNumber-inputCell-value',
  //     documentNumber,
  //   );

  //   await this.waitAndClickById('paymentPurposeCode');
  //   await this.waitAndClickById('DEPT-optionCellItem-touchable');

  //   await this.waitAndClickById('senderSourceOfCash');
  //   await this.waitAndClickById('SELF-optionCellItem-touchable');
  // }
}
