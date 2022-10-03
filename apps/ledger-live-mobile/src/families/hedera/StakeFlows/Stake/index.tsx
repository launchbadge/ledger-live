import React, { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getNodeList } from "@ledgerhq/live-common/families/hedera/api/mirror";

import { getStackNavigatorConfig } from "../../../../navigation/navigatorConfig";
import { ScreenName } from "../../../../const";

import StepHeader from "../../../../components/StepHeader";
import StepStakingInfo from "./01-StepStakingInfo";
import NodeListScreen from "./01a-NodeListScreen";

// import { CosmosValidatorItem } from "@ledgerhq/live-common/families/cosmos/types";
// import ConnectDevice from "../../../screens/ConnectDevice";
// import SelectDevice from "../../../screens/SelectDevice";
// import DelegationAmount from "../shared/02-SelectAmount";
// import SelectValidator from "./SelectValidator";
// import DelegationStarted from "./01-Started";
// import DelegationSummary from "./02-Summary";
// import DelegationValidationError from "./04-ValidationError";
// import DelegationValidationSuccess from "./04-ValidationSuccess";

const totalSteps = "3";

function StakeFlow() {

  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );

  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigationConfig,
        gestureEnabled: Platform.OS === "ios",
      }}
    >
      <Stack.Screen
        name={ScreenName.HederaStakeForm}
        component={StepStakingInfo}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("hedera.stake.stepperHeader.stake")}
              subtitle={t("hedera.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps,
              })}
            />
          ),
          headerLeft: () => null,
          headerStyle: {
            // ...defaultNavigationOptions.headerStyle,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          gestureEnabled: false,
        }}
      />
      {/* 
      <Stack.Screen
        name={ScreenName.HederaStakeSummary}
        component={TestComponent}
        options={{
          headerTitle: () => (
            <StepHeader title={t("cosmos.claimRewards.stepperHeader.method")} />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.HederaStakeConnectDevice}
        component={TestComponent}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("cosmos.claimRewards.stepperHeader.selectDevice")}
              subtitle={t("cosmos.claimRewards.stepperHeader.stepRange", {
                currentStep: "2",
                totalSteps,
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.CosmosClaimRewardsConnectDevice}
        component={TestComponent}
        options={{
          headerLeft: undefined,
          gestureEnabled: false,
          headerTitle: () => (
            <StepHeader
              title={t("cosmos.claimRewards.stepperHeader.connectDevice")}
              subtitle={t("cosmos.claimRewards.stepperHeader.stepRange", {
                currentStep: "3",
                totalSteps,
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.CosmosClaimRewardsValidationError}
        component={TestComponent}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.HederaStakeSuccess}
        component={TestComponent}
        options={{
          headerLeft: undefined,
          headerRight: undefined,
          headerTitle: "",
          gestureEnabled: false,
        }}
      /> */}
      <Stack.Screen
        name={ScreenName.HederaStakeNodeList}
        component={NodeListScreen}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("hedera.stake.stepperHeader.stake")}
              subtitle={t("hedera.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps,
              })}
            />
          ),
          headerStyle: {
            // ...defaultNavigationOptions.headerStyle,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
}

const options = {
  headerShown: false,
};

export { StakeFlow as component, options };

const Stack = createStackNavigator();
