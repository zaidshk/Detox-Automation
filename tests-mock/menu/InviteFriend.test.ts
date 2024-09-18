//shareInviteButton
//readMoreTouchable
//switchBar
//switchBarImage
//switchBarLabel
//coreText-inviteScreenIntroStep-title
//coreText-inviteScreenIntroStep-description
//coreText-totalRewardItem_0-totalRewards
//coreText-totalRewardItem_0-amount
import { log } from 'detox';

import DashboardPage from '../../pages/DashboardPage';
import InviteFriendPage from '../../pages/InviteFriendPage';
import LoginPage from '../../pages/LoginPage';
import SettingsPage from '../../pages/SettingsPage';
import { attachDeviceScreenShotToReport } from '../../utils/helper';

// const globalAny: any = global;
// const data: [any] = require(`../../data//settings/sof.json`);
const data: [any] = require('../../data/ui-tests/menu/inviteFriend.json');

const { addAttach, addMsg } = require('jest-html-reporters/helper');

describe.each(data)(
  'Invite Friend',
  ({
    featureId,
    country,
    countryCode,
    phoneNumber,
    passcode,
    sofType,
    deleteApp,
    scenarioId,
  }) => {
    const dashboardPage = new DashboardPage();
    const settingsPage = new SettingsPage();
    const loginPage = new LoginPage();

    const inviteFriend = new InviteFriendPage();

    beforeEach(async () => {
      log.info('*** it beforeEach ***');
      await device.launchApp({
        delete: deleteApp,
        launchArgs: {
          featureId: featureId,
          configType: 'mock',
          scenarioId: scenarioId,
        },
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
    });

    it(`Verify Invite Friend ${scenarioId}`, async () => {
      await loginPage.loginFlow(country, countryCode, phoneNumber, passcode);
      await dashboardPage.tapProfileBtn();
      await settingsPage.tapInviteFriendBtn();

      let elementsArray = [
        'shareInviteButton',
        'readMoreTouchable',
        'switchBar',
        'switchBarImage',
        'coreText-switchBarLabel',
        'coreText-inviteScreenIntroStep-title',
        'coreText-inviteScreenIntroStep-description',
      ];

      await inviteFriend.validateAllElementsExist(elementsArray);

      await inviteFriend.tapSwitchBarButton();

      elementsArray = [
        //'coreText-totalRewardItem_0-totalRewards',
        'coreText-totalRewardItem_0-amount',
      ];
      await inviteFriend.validateAllElementsExist(elementsArray, true);

      elementsArray = [
        'coreText-InviteHistory-name',
        'coreText-InviteHistory-status',
        'coreText-InviteHistory-amount',
      ];

      if (scenarioId === 'DATA') {
        await inviteFriend.validateAllElementsExist(elementsArray, true);

        await inviteFriend.tapSwitchBarButton();
        await inviteFriend.tapReadMoreButton();

        elementsArray = [
          'coreText-readMore-earnEachTime-title',
          'coreText-readMore-rewards-title',
        ];
        await inviteFriend.validateAllElementsExist(elementsArray);

        elementsArray = [
          'coreText-readMore-description-0',
          'coreText-readMore-description-1',
          'coreText-readMore-description-2',
          'coreText-readMore-description-3',
          'coreText-readMore-description-4',
          'coreText-readMore-description-5',
        ];

        //

        await inviteFriend.validateAllElementsVisibleInList(
          elementsArray,
          true,
          'readMore-bottomSheet',
          'down',
          20,
        );
      } else {
        await inviteFriend.validateAllElementsExist(elementsArray, false);
      }

      //
      //

      //

      //disabled true
      //disable false
    });

    afterEach(async () => {
      await attachDeviceScreenShotToReport('Screenshot', 'Test End');
    });

    afterAll(async () => {
      log.info('*** Final afterAll ***');
      device.terminateApp();
    });
  },
);
