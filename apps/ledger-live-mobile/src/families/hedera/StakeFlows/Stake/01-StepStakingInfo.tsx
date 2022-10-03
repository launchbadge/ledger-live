import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { Trans } from "react-i18next";
import invariant from "invariant";
import { getAccountBridge } from "@ledgerhq/live-common/bridge/index";
import useBridgeTransaction from "@ledgerhq/live-common/bridge/useBridgeTransaction";
import { getMainAccount } from "@ledgerhq/live-common/account/index";
import { STAKE_METHOD } from "@ledgerhq/live-common/families/hedera/types";
import { capitalize } from "@ledgerhq/live-common/families/hedera/utils";
import { getNodeList } from "@ledgerhq/live-common/families/hedera/api/mirror";

import { accountScreenSelector } from "../../../../reducers/accounts";
import LText from "../../../../components/LText";

import StakeMethodSelect from "../components/StakeMethodSelect";
import StakeToAccountInput from "../components/StakeToAccountInput";
import StakeToNodeSelect from "../components/StakeToNodeSelect";
import DeclineRewardsCheckBox from "../components/DeclineRewardsCheckBox";

import type {
  Transaction,
  StakeMethod,
} from "@ledgerhq/live-common/families/hedera/types";

type RouteParams = {
  accountId: string;
  transaction: Transaction;
};
type Props = {
  navigation: any;
  route: {
    params: RouteParams;
  };
};

function StepStakingInfo({ navigation, route }: Props) {
  // TODO: remove, fetch on node list selector
  // const [nodeList, setNodeList] = useState<any[]>([]); // TODO: make proper array type

  // useEffect(() => {
  //   const fetchNodeList = async () => {
  //     const nodeList = (await getNodeList()).map(node => ({
  //       label: node.node_account_id,
  //       value: node.node_id,
  //       data: node.node_id,
  //     }));

  //     setNodeList(nodeList);
  //   };

  //   fetchNodeList();
  // });

  const { colors } = useTheme();
  const { account } = useSelector(accountScreenSelector(route));
  invariant(account, "account required");
  const mainAccount = getMainAccount(account, undefined);
  const bridge = getAccountBridge(account, undefined);

  const { transaction } = useBridgeTransaction(() => {
    const t = bridge.createTransaction(mainAccount);

    return {
      account, // TODO: do i need this?
      transaction: bridge.updateTransaction(t, {
        // mode: "claimReward",
      }),
    };
  });

  const stakeMethods = [
    {
      label: capitalize(STAKE_METHOD.NODE),
      value: STAKE_METHOD.NODE,
    },
    {
      label: capitalize(STAKE_METHOD.ACCOUNT),
      value: STAKE_METHOD.ACCOUNT,
    },
  ];

  // TODO: maybe strange warning (w/ the AlgorandTx) is because of wrong import source?
  const [stakeMethod, setStakeMethod] = useState(
    transaction?.staked?.stakeMethod ?? STAKE_METHOD.NODE,
  );
  const [stakeToAccount, setStakeToAccount] = useState(
    transaction?.staked?.accountId ?? "",
  );
  const [stakeToNode, setStakeToNode] = useState(
    transaction?.staked?.nodeId ?? null,
  );
  const [declineRewards, setDeclineRewards] = useState(
    transaction?.staked?.declineRewards ?? false,
  );

  // TODO: think of whether it's worth making a fnc
  // that uses `switch` and filters via `type` param?
  const handleAccountIdChange = accountId => {
    setStakeToAccount(accountId);

    invariant(transaction, "transaction required");
    bridge.updateTransaction(transaction, {
      staked: {
        ...transaction.staked,

        accountId: accountId,
        stakeMethod: STAKE_METHOD.ACCOUNT,
      },
    });
  };

  const handleNodeIdChange = ({ value: nodeId }) => {
    setStakeToNode(nodeId);

    invariant(transaction, "transaction required");
    bridge.updateTransaction(transaction, {
      staked: {
        ...transaction.staked,

        nodeId: nodeId,
        stakeMethod: STAKE_METHOD.NODE,
      },
    });
  };

  const handleDeclineRewardsChange = result => {
    setDeclineRewards(result);

    invariant(transaction, "transaction required");
    bridge.updateTransaction(transaction, {
      staked: {
        ...transaction.staked,

        declineRewards: result,
      },
    });
  };

  const handleStakeMethodChange = (stakeMethod: StakeMethod) => {
    // need to update bridge `transaction` to trigger for `status` errors
    clearOtherStakeMethod(stakeMethod);
  };

  /**
   * If @param stakeMethod is `StakeMethod.NODE`, clear account id input on UI and bridge `transaction`
   * If @param stakeMethod is `StakeMethod.ACCOUNT`, clear node id input on UI and bridge `transaction`
   */
  const clearOtherStakeMethod = (stakeMethod: StakeMethod) => {
    invariant(transaction, "transaction required");

    setStakeMethod(stakeMethod);

    if (stakeMethod === STAKE_METHOD.NODE) {
      setStakeToAccount("");

      bridge.updateTransaction(transaction, {
        staked: {
          ...transaction.staked,

          accountId: null,
          stakeMethod,
        },
      });
    }

    if (stakeMethod === STAKE_METHOD.ACCOUNT) {
      setStakeToNode(null);

      bridge.updateTransaction(transaction, {
        staked: {
          ...transaction.staked,

          nodeId: null,
          stakeMethod,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* stake method selector */}
      <StakeMethodSelect
        value={stakeMethod}
        options={stakeMethods}
        onChange={handleStakeMethodChange}
      />

      <View style={styles.methodInputWrapper}>
        {/* stake to node */}
        {/* TODO: need to figure out how to have select list on mobile */}
        {stakeMethod === STAKE_METHOD.NODE ? (
          <StakeToNodeSelect
            selected={stakeToNode}
            // nodeList={nodeList}
            onChange={handleNodeIdChange}
          />
        ) : null}

        {/* stake to account */}
        {stakeMethod === STAKE_METHOD.ACCOUNT ? (
          <StakeToAccountInput
            value={stakeToAccount}
            onChange={handleAccountIdChange}
          />
        ) : null}
      </View>

      {/* separator */}
      <View style={styles.separatorContainer}>
        <View
          style={[
            styles.separatorLine,
            {
              borderBottomColor: colors.lightFog,
            },
          ]}
        />
      </View>

      {/* `Receive rewards` checkbox */}
      <DeclineRewardsCheckBox
        isChecked={declineRewards}
        onChange={handleDeclineRewardsChange}
      />
    </View>

    // TODO: add button that invokes `onNext` that will utilize `navigation` to change to next screen
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 32,
    marginHorizontal: 16,
  },
  methodInputWrapper: {
    marginBottom: 48,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  separatorLine: {
    flex: 1,
    borderBottomWidth: 1,
    marginBottom: 32,
  },
});

export default StepStakingInfo;
