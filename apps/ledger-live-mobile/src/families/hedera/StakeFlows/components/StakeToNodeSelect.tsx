import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Text } from "@ledgerhq/native-ui";

import { ScreenName } from "../../../../const";
import SettingsRow from "../../../../components/SettingsRow";

type Props = {
  selected: string;
  nodeList: any | null; // TODO: add proper type?
  onChange: () => void;
};

function StakeToNodeSelect({ selected, nodeList, onChange }: Props) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  // TODO: make `node` param proper type?
  if (selected) {
    selected = nodeList.find((node: any) => node.value === selected);
  }

  return (
    <SettingsRow
      style={styles.container}
      event="HederaStakeNodeListSettingsRow"
      title={t("hedera.stake.flow.steps.stake.to.node")}
      // desc={t("settings.display.counterValueDesc")}
      arrowRight
      compact
      onPress={() => navigate(ScreenName.HederaStakeNodeList, { nodeList })}
    >
      <Text variant={"body"} fontWeight={"medium"} color="primary.c80">
        {/* TODO: make this currently selected node */}
        {selected}
      </Text>
    </SettingsRow>
  );
}

const styles = StyleSheet.create({
  container: {
    "margin": -2,
  }
});

export default StakeToNodeSelect;
