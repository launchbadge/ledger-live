import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import invariant from "invariant";
import { Text } from "@ledgerhq/native-ui";
import { getAccountBridge } from "@ledgerhq/live-common/bridge/index";
import { getMainAccount } from "@ledgerhq/live-common/account/index";
import useBridgeTransaction from "@ledgerhq/live-common/bridge/useBridgeTransaction";

import { ScreenName } from "../../../../const";
import { accountScreenSelector } from "../../../../reducers/accounts";
import Button from "../../../../components/Button";

import type { StakeType } from "@ledgerhq/live-common/families/hedera/types";

type RouteParams = {
  stakeType: StakeType;
};
type Props = {
  navigation: any;
  route: {
    params: RouteParams;
  };
};

function StepConfirmation({ navigation, route }: Props) {
  const { account } = useSelector(accountScreenSelector(route));
  invariant(account, "account required");
  const mainAccount = getMainAccount(account, undefined);
  const bridge = getAccountBridge(account, undefined);

  const {
    params: { stakeType },
  } = route;

  const { transaction } = useBridgeTransaction(() => {
    const t = bridge.createTransaction(mainAccount);

    return {
      account, // TODO: do i need this?
      transaction: bridge.updateTransaction(t, {
        mode: "stake",
        staked: {
          stakeType,
        },
      }),
    };
  });

  const onYes = useCallback(() => {
    navigation.navigate(ScreenName.HederaStakeSelectDevice, {
      ...route.params,
      transaction,
    });
  }, [navigation]);

  const onNo = useCallback(() => {
    navigation.getParent().pop();
  }, [navigation]);

  return (
    <>
      <Text fontSize={16} style={styles.description}>
        <Trans i18nKey="hedera.stake.flow.steps.stop.description" />
      </Text>

      <Button
        type="primary"
        outline={false}
        title={
          <Trans i18nKey="hedera.stake.flow.steps.stake.declineRewards.yes" />
        }
        containerStyle={styles.yesButton}
        onPress={onYes}
      />
      <Button
        type="secondary"
        title={
          <Trans i18nKey="hedera.stake.flow.steps.stake.declineRewards.no" />
        }
        containerStyle={styles.noButton}
        onPress={onNo}
      />
    </>
  );
}

const styles = StyleSheet.create({
  description: {
    marginTop: 30,
    marginBottom: 50,
    textAlign: "center",
  },
  yesButton: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  noButton: {
    marginHorizontal: 10,
  },
});

export default StepConfirmation;
