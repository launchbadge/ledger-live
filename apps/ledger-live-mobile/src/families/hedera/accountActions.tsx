import React from "react";
import { Trans } from "react-i18next";
import { Icons } from "@ledgerhq/native-ui";
import {
  HederaAccount,
  STAKE_TYPE,
} from "@ledgerhq/live-common/lib/families/hedera/types";

import { NavigatorName, ScreenName } from "../../const";

const getActions = ({ account }: { account: HederaAccount }) => {
  const {
    hederaResources,
    pendingOperations,
    operations: confirmedOperations,
  } = account;

  // TODO: implement conditionally disabling stake-related buttons
  // if all operations are not confirmed

  const stakeAction = {
    navigationParams: [
      NavigatorName.HederaStakeFlow,
      {
        screen: ScreenName.HederaStakeForm,
        params: { stakeType: STAKE_TYPE.NEW }, // TODO: need to test where this gets passed to screen
      },
    ],
    icon: Icons.ClaimRewardsMedium,
    label: <Trans i18nKey="hedera.stake.flow.steps.stake.title" />,
    // disabled: !allOpsConfirmed,
  };
  const changeStakedToAction = {
    navigationParams: [
      NavigatorName.HederaStakeFlow,
      {
        screen: ScreenName.HederaStakeForm,
        params: { stakeType: STAKE_TYPE.CHANGE },
      },
    ],
    icon: Icons.ClaimRewardsMedium,
    label: <Trans i18nKey="hedera.stake.flow.steps.changeStake.title" />,
    // disabled: !allOpsConfirmed,
  };
  const stopStakingAction = {
    navigationParams: [
      NavigatorName.HederaStopStakeFlow,
      {
        screen: ScreenName.HederaStakeStopConfirmation,
        params: { stakeType: STAKE_TYPE.STOP },
      },
    ],
    icon: Icons.ClaimRewardsMedium,
    label: <Trans i18nKey="hedera.stake.flow.steps.stop.title" />,
    // disabled: !allOpsConfirmed,
  };

  // array containing which buttons to show depending on account's staking status
  const actionList = [];

  //   TODO: uncomment this portion when ready to test actual flow
  //   // if account is already staking to a node or account id,
  //   // show `Change Staked To and `Stop Staking` buttons
  //   if (hederaResources?.staked?.stakeMethod != null) {
  //     actionList.push(changeStakedToAction, stopStakingAction);
  //   } else {
  //     // otherwise, show `Stake` button
  //     actionList.push(stakeAction);
  //   }

  //   NOTE: TESTING
  actionList.push(stakeAction, stopStakingAction);

  return actionList;
};

export default {
  getActions,
};
