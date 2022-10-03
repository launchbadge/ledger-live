import React, { useState, useEffect } from "react";
import { Trans } from "react-i18next";
import { Text } from "@ledgerhq/native-ui";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { getNodeList } from "@ledgerhq/live-common/families/hedera/api/mirror";

import FilteredSearchBar from "../../../../components/FilteredSearchBar";
import LText from "../../../../components/LText";

const StyledRectButton = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 30px 16px;
`;

type RouteParams = {
  nodeList: any;
};
type Props = {
  navigation: any;
  route: {
    params: RouteParams;
  };
};

function NodeListScreen({ navigation, route }: Props) {
  const { colors } = useTheme();

  const [nodeList, setNodeList] = useState<any[]>([]); // TODO: make proper array type

  //   TODO: have busy state to indicate fetching node list?
  useEffect(() => {
    const fetchNodeList = async () => {
      const nodeList = (await getNodeList()).map(node => ({
        label: node.node_account_id,
        value: node.node_id,
        data: node.node_id,
      }));

      setNodeList(nodeList);
    };

    fetchNodeList();
  });

  //   const nodeList = route.params.nodeList;

  const onNodePress = () => {
    // update bridge tx with selection
    // nav back to "form" screen
  };

  const renderList = (items: string[]) => (
    <FlatList
      contentContainerStyle={styles.list}
      data={items}
      renderItem={({ item }) => (
        <StyledRectButton onPress={onNodePress}>
          <Text>{item.label}</Text>
        </StyledRectButton>
      )}
      //   keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptySearch}>
      <LText style={styles.emptySearchText}>
        <Trans i18nKey="hedera.stake.flow.steps.nodeList.noNodeFound" />
      </LText>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.searchContainer}>
        <FilteredSearchBar
          inputWrapperStyle={styles.filteredSearchInputWrapperStyle}
          list={nodeList}
          renderList={renderList}
          renderEmptySearch={renderEmptyList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  searchContainer: {
    paddingTop: 16,
    flex: 1,
  },
  list: {
    paddingBottom: 32,
  },
  filteredSearchInputWrapperStyle: {
    marginHorizontal: 16,
  },
  emptySearch: {
    paddingHorizontal: 16,
  },
  emptySearchText: {
    textAlign: "center",
  },
});

export default NodeListScreen;
