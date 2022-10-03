import React, { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getNodeList } from "@ledgerhq/live-common/families/hedera/api/mirror";

import { getStackNavigatorConfig } from "../../../../navigation/navigatorConfig";
import { ScreenName } from "../../../../const";

import StepHeader from "../../../../components/StepHeader";
import StepConfirmation from "./01-StepConfirmation";
import ConnectDevice from "../../../../screens/ConnectDevice";
import SelectDevice from "../../../../screens/SelectDevice";

// import { CosmosValidatorItem } from "@ledgerhq/live-common/families/cosmos/types";
// import ConnectDevice from "../../../screens/ConnectDevice";
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
      {/* Stop Stake confirmation screen */}
      <Stack.Screen
        name={ScreenName.HederaStakeStopConfirmation}
        component={StepConfirmation}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("hedera.stake.stepperHeader.confirmation")}
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

      {/* Device Selection / Connect screens */}
      <Stack.Screen
        name={ScreenName.HederaStakeSelectDevice}
        component={SelectDevice}
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
        name={ScreenName.HederaStakeConnectDevice}
        component={ConnectDevice}
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

      {/* Transaction Success / Error screens */}
      {/* TODO: need to test */}
      <Stack.Screen
        name={ScreenName.CosmosClaimRewardsValidationError}
        component={ClaimRewardsValidationError}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.CosmosClaimRewardsValidationSuccess}
        component={ClaimRewardsValidationSuccess}
        options={{
          headerLeft: undefined,
          headerRight: undefined,
          headerTitle: "",
          gestureEnabled: false,
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
