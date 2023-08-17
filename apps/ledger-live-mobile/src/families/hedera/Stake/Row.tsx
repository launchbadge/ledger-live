import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import {
  CosmosMappedDelegation,
  CosmosMappedUnbonding,
} from "@ledgerhq/live-common/families/cosmos/types";
import { CryptoOrTokenCurrency } from "@ledgerhq/types-cryptoassets";
import { useTheme } from "@react-navigation/native";
import { Text } from "@ledgerhq/native-ui";
import cryptoFactory from "@ledgerhq/live-common/families/cosmos/chain/chain";
import CounterValue from "../../../components/CounterValue";
import ArrowRight from "../../../icons/ArrowRight";
import LText from "../../../components/LText";
import { HederaStake } from "@ledgerhq/live-common/families/hedera/types";
import { getNodeList } from "@ledgerhq/live-common/families/hedera/api/mirror";

type Props = {
  delegation: HederaStake
  isLast?: boolean;
};

export default function DelegationRow({
  delegation,
  isLast = false,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { accountId, nodeId, pendingRewards } = delegation;

    
  const [nodeDescription, setNodeDescription] = useState("")

  useEffect(() => {
    async function getNodeListState() {
      // fetch list of stake-able nodes
      const nodeList = await getNodeList();

      const description = nodeList.find(node => node.node_id === delegation.nodeId)?.description;

      if (description != undefined) {
        setNodeDescription(description.replace("Hosted by ", ""));
      }
    }
    if (!nodeDescription) {
      getNodeListState();
    }
  });

  return (
    <TouchableOpacity
      style={[
        styles.row,
        styles.wrapper,
        !isLast
          ? { ...styles.borderBottom, borderBottomColor: colors.lightGrey }
          : undefined,
      ]}
      onPress={() => onPress(delegation)}
    >
      <View style={[styles.icon]}>
        <Text>{nodeId ? nodeId : accountId}</Text>
      </View>

      <View style={styles.nameWrapper}>
        <Text variant={"body"} fontWeight={"semiBold"} numberOfLines={1}>
          {nodeDescription ?? accountId}
        </Text>

        <View style={styles.row}>
          <LText style={styles.seeMore} color="live">
            {t("common.seeMore")}
          </LText>
          <ArrowRight color={colors.live} size={14} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMore: {
    fontSize: 14,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 5,

    marginRight: 12,
  },
  nameWrapper: {
    flex: 1,
    marginRight: 8,
  },
  rightWrapper: {
    alignItems: "flex-end",
  },
});
