import axios from 'axios';
import { createHash } from 'crypto';
import { log } from 'detox';
import { ID } from 'graphql-ws';

import awsConfig from '../data/awsconfig.json';

import { LoadLocation } from '../../models';
import {
  estimateChargeGraphql,
  getManualLoadPageDetailsGraphql,
  listAccountsGraphql,
  listCardsGraphql,
  listLoadLocationsGraphql,
  listLoadMethodsGraphql,
  listPnwCategoriesGraphql,
  listServiceFeaturesGraphql,
  listTransactionHistoryItemsGraphql,
} from '../../src/graphqlcustom/queries';
import {
  Account,
  Category,
  Currency,
  DataAttribute,
  LoadMethod,
} from '../../src/types/commons';
import { roundAmountNumber } from '../../src/utils/amount';
import url, { baseUrl } from '../env/env';
import { getDefaultAccount } from './helper';

export const getUsername = async (phoneNumber: string) => {
  try {
    log.info('url.USER_LOOKUP for number', url.USER_LOOKUP, phoneNumber);

    const response = await axios.get(`${url.USER_LOOKUP}/${phoneNumber}`);
    return response.data.userId;
  } catch (e) {
    log.info('getUsername Error', e);
  }
};

export const getOTP = async (phoneNumber: string) => {
  try {
    const response = await axios.get(`${url.OTP}/${phoneNumber}`);
    return response.data.otp;
  } catch (e) {
    log.info('getOTP Error', e);
  }
};

export const getChallenge = async (username: string) => {
  try {
    const headers = {
      'x-amz-user-agent': 'aws-amplify/5.0.4 react-native',
      'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      'Content-Type': 'application/x-amz-json-1.1',
    };
    const requestBody = {
      AuthFlow: awsConfig.config.AuthFlow,
      ClientId: awsConfig.config.ClientId,
      AuthParameters: { USERNAME: `${username}` },
    };
    const response = await axios.post(url?.COGNITO, requestBody, { headers });
    log.info('getChallenge -> response', response);
    return response;
  } catch (e) {
    log.info('getChallenge -> error', e);
  }
};

export const answerCustomChallenge = async (
  username: string,
  answer: string,
  session: string,
) => {
  log.info('answerCustomChallenge-> answer', answer);
  try {
    const headers = {
      'x-amz-user-agent': 'aws-amplify/5.0.4 react-native',
      'x-amz-target':
        'AWSCognitoIdentityProviderService.RespondToAuthChallenge',
      'Content-Type': 'application/x-amz-json-1.1',
    };
    const reqBody2 = {
      ChallengeName: 'CUSTOM_CHALLENGE',
      ChallengeResponses: {
        USERNAME: `${username}`,
        ANSWER: answer,
      },
      ClientId: awsConfig.config.ClientId,
      Session: session,
      ClientMetadata: {
        deviceHardwareId: '84C85531-ECE6-40AD-9A3C-50F391B1604E',
      },
    };
    const response = await axios.post(url?.COGNITO, reqBody2, { headers });
    log.info('answerCustomChallenge -> response', response);
    return response;
  } catch (e) {
    log.info('answerCustomChallenge Error', e);
  }
};

export const getAccount = async (
  username: string,
  idToken: string,
): Promise<[Account]> => {
  log.info('username', username);

  const data = JSON.stringify({
    query: listAccountsGraphql,
    variables: { userId: username },
  });

  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  const accounts = await axios
    .request(config)
    .then((response: any) => {
      log.info(
        'getAccount -> response',
        JSON.stringify(response.data.data.listAccounts.data),
      );
      return response.data.data.listAccounts.data;
    })
    .catch((error: any) => {
      log.error(error);
    });

  return accounts;
};

export async function getToken(
  username: string,
  phoneNumber: string,
  passcode: string,
) {
  //MSISDN_ENTRY
  //MSISDN_VERIFICATION
  //PASSCODE_VERIFICATION

  const challengeResponse: any = await getChallenge(username);

  let answerResponse: any = await answerCustomChallenge(
    username,
    phoneNumber,
    challengeResponse.data.Session,
  );

  const otp = await getOTP(phoneNumber);
  answerResponse = await answerCustomChallenge(
    username,
    otp,
    answerResponse.data.Session,
  );

  const generateHash = (text: any) => {
    return createHash('sha256')
      .update(Buffer.from(text))
      .digest()
      .toString('hex');
  };

  const passcodeHash = generateHash(passcode);
  log.info('passHash', passcodeHash);
  answerResponse = await answerCustomChallenge(
    username,
    passcodeHash,
    answerResponse.data.Session,
  );

  log.info('Token', answerResponse.data.AuthenticationResult.IdToken);
  return answerResponse.data.AuthenticationResult.IdToken;
}

export const fetchUserAccountDetails = async (
  countryCode: string,
  phoneNumber: string,
  passcode: string,
) => {
  const username = await getUsername(`${countryCode}${phoneNumber}`);
  log.info('username **', username);

  const token = await getToken(
    username,
    `${countryCode}${phoneNumber}`,
    passcode,
  );

  const accounts = await getAccount(username, token);
  const defaultAccount = await getDefaultAccount(accounts);
  return { username, token, accounts, defaultAccount };
};

export const sendMoneyCategories = async (
  idToken: string,
  accountId: ID,
): Promise<Category[] | null> => {
  const data = JSON.stringify({
    query: listPnwCategoriesGraphql,
    variables: { accountId: accountId },
  });

  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  const categories = await axios
    .request(config)
    .then((response: any) => {
      log.info('sendMoneyCategories -> response', response);
      return response?.data?.data?.listPnwCategories;
    })
    .catch((error: any) => {
      log.error(error);
    });
  log.info('found catagories ***', categories);
  return categories;
};

export const getRemittanceFees = async (
  idToken: string,
  accountId: ID,
  currencyFrom: Currency,
  amountFrom: number,
  currencyTo: Currency,
  countryTo: string,
  actionName: string,
): Promise<any> => {
  const input = JSON.stringify({
    query: estimateChargeGraphql,
    variables: {
      accountId: accountId,
      actionName,
      input: {
        accountTo: accountId,
        currencyFrom,
        currencyTo,
        amountFrom,
        countryTo,
      },
    },
  });

  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: input,
  };

  const reponse = await axios
    .request(config)
    .then((response: any) => {
      const data = response?.data?.data?.estimateCharge;
      log.info('getRemittanceFees -> response', data);
      let fee = data?.charge?.fixed;

      if (data?.charge?.variable && amountFrom) {
        fee = fee + data.charge.variable / 10000;
        // Fee based on variable amount
        fee = roundAmountNumber(amountFrom * fee);
      }

      if (fee !== null || fee !== undefined) {
        const updatedFees = [{ ...data, amount: fee }];

        return updatedFees;
      }
    })
    .catch((error: any) => {
      log.error(error);
    });

  return null;
};

export const getManualBankTransferDetails = async (
  idToken: string,
  name = 'Load Provider Bank Transfer',
): Promise<Array<DataAttribute | null>> => {
  log.info('getManualBankTransferDetails -> name', name);

  const input = JSON.stringify({
    query: getManualLoadPageDetailsGraphql,
    variables: {
      name: name,
    },
  });

  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: input,
  };

  const reponse = await axios
    .request(config)
    .then((response: any) => {
      log.info('getManualBankTransferDetails -> response', response);
      const data = response?.data?.data?.getManualLoadPageDetails;
      log.info('getManualBankTransferDetails -> response', data);
      return data.attributes;
    })
    .catch((error: any) => {
      log.error(error);
    });

  return reponse;
};

export const listLoadMethodTypes = async (
  idToken: string,
  accountId: string,
  currency: string,
): Promise<LoadMethod[]> => {
  log.info('listLoadMethodTypes');

  const input = JSON.stringify({
    query: listLoadMethodsGraphql,
    variables: {
      accountId: accountId,
      input: {
        currencyTo: currency,
      },
    },
  });

  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: input,
  };

  const reponse = await axios
    .request(config)
    .then((response: any) => {
      //log.info('listLoadMethods -> response', response);
      const data = response?.data?.data?.listLoadMethods;
      //log.info('listLoadMethods -> response', data);
      return data;
    })
    .catch((error: any) => {
      log.error('error ** ', error);
    });

  //log.info('listLoadMethods -> response **', reponse);
  return reponse;
};

export const listLoadLocations = async (
  idToken: string,
  latitude = 25.2769,
  longitude = 55.2962,
): Promise<LoadLocation[]> => {
  log.info('listLoadLocations **');
  const input = JSON.stringify({
    query: listLoadLocationsGraphql,
    variables: {
      offset: 0,
      limit: 50,
      input: {
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      },
    },
  });

  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: input,
  };

  const response = await axios
    .request(config)
    .then((response: any) => {
      const data = response?.data?.data?.listLoadLocations;
      return data;
    })
    .catch((error: any) => {
      log.error('error ** ', error);
    });

  return response;
};

export const getAccountCards = async (
  idToken: string,
  accountId: string,
): Promise<any> => {
  const input = JSON.stringify({
    query: listCardsGraphql,
    variables: {
      accountId: accountId,
      cardIssuer: 'PCKT',
    },
  });
  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: input,
  };

  const reponse = await axios
    .request(config)
    .then((response: any) => {
      log.info('getAccountCards -> response', response);
      const data = response?.data?.data?.getAccountCards;
      log.info('getAccountCards -> response', data);
      return data;
    })
    .catch((error: any) => {
      log.error('error ** ', error);
    });

  return reponse;
};
export const getListServiceFeature = async (
  idToken: string,
  accountId: string,
  userId: string,
): Promise<any> => {
  const input = JSON.stringify({
    query: listServiceFeaturesGraphql,
    variables: {
      accountId: accountId,
      userId: userId,
    },
  });
  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: input,
  };

  const reponse = await axios
    .request(config)
    .then((response: any) => {
      log.info('getListServiceFeature -> response', response);
      const data = response?.data?.data?.listServiceFeatures;
      log.info('getListServiceFeature -> response', data);
      return data;
    })
    .catch((error: any) => {
      log.error('error ** ', error);
    });
  return reponse;
};

export const getCardFees = async (
  idToken: string,
  accountId: ID,
  actionName: string,
): Promise<any> => {
  const input = JSON.stringify({
    query: estimateChargeGraphql,
    variables: {
      accountId: accountId,
      actionName,
      input: {},
    },
  });

  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: input,
  };

  const reponse = await axios
    .request(config)
    .then((response: any) => {
      const data = response?.data?.data?.estimateCharge;
      log.info('getCardFees -> response', data);
      let fee = data?.charge?.fixed;
      if (data?.charge?.variable) {
        fee = fee + data.charge.variable / 10000;
        // Fee based on variable amount
        fee = roundAmountNumber(fee);
      }
      if (fee !== null || fee !== undefined) {
        const updatedFees = [{ ...data, amount: fee }];
        return updatedFees;
      }
    })
    .catch((error: any) => {
      log.error(error);
    });
  return reponse;
};

export const getCardTransationHistory = async (
  idToken: string,
  accountId: ID,
  cardId: string,
): Promise<any> => {
  const input = JSON.stringify({
    query: listTransactionHistoryItemsGraphql,
    variables: {
      accountId: accountId,
      offset: 0,
      filters: [
        {
          attributeName: 'metadata.metaData.cardId',
          attributeValue: cardId,
          operator: 'EQ',
        },
      ],
    },
  });

  const config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    data: input,
  };

  const reponse = await axios
    .request(config)
    .then((response: any) => {
      const data = response?.data?.data?.listTransactionHistoryItems;
      log.info('listTransactionHistoryItems -> response', data);
      return data;
    })
    .catch((error: any) => {
      log.error('error ** ', error);
    });
  return reponse;
};

export const getCardTransaction = async (
  cardID: string,
  last4digit: string,
) => {
  try {
    const headers = {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    };
    const requestBody = {
      '0': '1100',
      '2': `5374********${last4digit}`,
      '3': '000000',
      '4': '1000',
      '6': '1000',
      '9': '61000000',
      '11': '000001',
      '12': '191002163521',
      '14': '2009',
      '22': 'M1010151134C',
      '23': '001',
      '24': '200',
      '26': '5999',
      '32': '2330076xg1',
      '33': '23300000',
      '38': '0106202302',
      '41': '0000000',
      '42': '200200001374',
      '43': 'Card Transaction Desc for Test Automation',
      '49': '840',
      '51': '978',
      '102': cardID,
    };
    const response = await axios.post(
      'https://integrations.dev.pyypl.io/pckt/iso8583',
      requestBody,
      { headers },
    );
    log.info('getCardTransaction -> response', response);
    return response;
  } catch (e) {
    log.info('getCardTransaction -> error', e);
  }
};
