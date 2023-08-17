import { HederaAccount } from "@ledgerhq/live-common/families/hedera/types";
import React, { useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  getMainAccount,
} from "@ledgerhq/live-common/account/index";
import { Box, Text } from "@ledgerhq/native-ui";
import { AccountLike } from "@ledgerhq/types-live";
import { StackNavigationProp } from "@react-navigation/stack";
import AccountDelegationInfo from "../../../components/AccountDelegationInfo";
import IlluRewards from "../../../icons/images/Rewards";
import { urls } from "../../../config/urls";
import AccountSectionLabel from "../../../components/AccountSectionLabel";
import DelegationDrawer from "../../../components/DelegationDrawer";
import type { IconProps } from "../../../components/DelegationDrawer";
import { rgba } from "../../../colors";
import { ScreenName, NavigatorName } from "../../../const";
import Circle from "../../../components/Circle";
import LText from "../../../components/LText";
import RedelegateIcon from "../../../icons/Redelegate";
import UndelegateIcon from "../../../icons/Undelegate";
import DelegationRow from "./Row";


type Props = {
    account: HederaAccount;
};

type DelegationDrawerProps = React.ComponentProps<typeof DelegationDrawer>;
type DelegationDrawerActions = DelegationDrawerProps["actions"];

function Delegations({ account }: Props) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { hederaResources } = getMainAccount(account) as HederaAccount;
    const { staked } = hederaResources;
    // const delegations: CosmosMappedDelegation[] =
    //   useCosmosFamilyMappedDelegations(mainAccount);
  
    // const currency = getAccountCurrency(mainAccount);
    // const unit = getAccountUnit(mainAccount);
    const navigation = useNavigation();
  
    // const { validators } = useCosmosFamilyPreloadData(account.currency.id);
  
    // const { cosmosResources } = mainAccount;
  
    // const undelegations =
    //   cosmosResources &&
    //   cosmosResources.unbondings &&
    //   mapUnbondings(cosmosResources.unbondings, validators, unit);
    // const bridge = getAccountBridge(account, undefined);
    // const { transaction } = useBridgeTransaction(() => {
    //   const t = bridge.createTransaction(mainAccount);
    //   const { validatorSrcAddress } = { ...banner };
    //   return {
    //     account,
    //     transaction: bridge.updateTransaction(t, {
    //       mode: "redelegate",
    //       validators: [],
    //       sourceValidator: validatorSrcAddress,
    //     }),
    //   };
    // });
    // const [delegation, setDelegation] = useState<CosmosMappedDelegation>();
    // const [undelegation, setUndelegation] = useState<CosmosMappedUnbonding>();
    // const [banner, setBanner] = useState<
    //   AccountBannerState & { description: string; cta: string }
    // >({
    //   display: false,
    //   description: "",
    //   cta: "",
    //   redelegate: false,
    //   validatorSrcAddress: "",
    //   ledgerValidator: undefined,
    // });
  
    // const totalRewardsAvailable = delegations.reduce(
    //   (sum, d) => sum.plus(d.pendingRewards || 0),
    //   BigNumber(0),
    // );
  
    const onNavigate = useCallback(
      ({
        route,
        screen,
        params,
      }: {
        route: string;
        screen?: string;
        params?: { [key: string]: unknown };
      }) => {
        (navigation as StackNavigationProp<{ [key: string]: object }>).navigate(
          route,
          {
            screen,
            params: { ...params, accountId: account.id },
          },
        );
      },
      [navigation, account.id],
    );
  
    const onDelegate = useCallback(() => {
      onNavigate({
        route: NavigatorName.HederaStakeFlow,
        screen: ScreenName.HederaStakingStarted,
      });
    }, [onNavigate, account]);
  
    const onRedelegate = useCallback(() => {
      onNavigate({
        route: NavigatorName.HederaStakeFlow,
        screen: ScreenName.HederaStakingStarted,
      });
    }, [onNavigate, account]);
  
    // useEffect(() => {
    //   const state = getCosmosBannerState({ ...account });
    //   const bannerText = getCosmosBannerProps(state, { t }, account);
    //   setBanner({ ...state, ...bannerText });
    // }, [account, t]);
  
    // const onRedelegateLedger = () => {
    //   const { validatorSrcAddress, ledgerValidator } = { ...banner };
    //   const worstValidator = delegations.find(
    //     delegation => delegation.validatorAddress === validatorSrcAddress,
    //   );
    //   onNavigate({
    //     route: NavigatorName.CosmosRedelegationFlow,
    //     screen: ScreenName.CosmosDefaultRedelegationAmount,
    //     params: {
    //       accountId: account.id,
    //       validatorSrcAddress,
    //       transaction: {
    //         ...transaction,
    //         sourceValidator: validatorSrcAddress,
    //       },
    //       validatorSrc: worstValidator?.validator,
    //       validator: ledgerValidator,
    //       max: worstValidator?.amount,
    //       nextScreen: ScreenName.CosmosRedelegationSelectDevice,
    //     },
    //   });
    // };
  
    // const onCollectRewards = useCallback(() => {
    //   onNavigate({
    //     route: NavigatorName.CosmosClaimRewardsFlow,
    //     screen: delegation
    //       ? ScreenName.CosmosClaimRewardsMethod
    //       : ScreenName.CosmosClaimRewardsValidator,
    //     params: delegation
    //       ? {
    //           validator: delegation.validator,
    //           value: delegation.pendingRewards,
    //         }
    //       : {},
    //   });
    // }, [onNavigate, delegation]);
  
    const onUndelegate = useCallback(() => {
      onNavigate({
        route: NavigatorName.HederaStakeFlow,
        screen: ScreenName.HederaStakeStopConfirmation,
      });
    }, [onNavigate, account]);
  
    const onCloseDrawer = useCallback(() => {
    }, []);
  
    // const onOpenExplorer = useCallback(
    //   (address: string) => {
    //     const url = getAddressExplorer(
    //       getDefaultExplorerView(account.currency),
    //       address,
    //     );
    //     if (url) Linking.openURL(url);
    //   },
    //   [account.currency],
    // );
  
    const data = useMemo<DelegationDrawerProps["data"]>(() => {
      const hasStake = staked.accountId != null || staked.nodeId != null;

      // const redelegation = delegation && getRedelegation(account, delegation);
  
      return hasStake
        ? [
            {
              label: t("delegation.validator"),
              Component: (
                <LText
                  numberOfLines={1}
                  semiBold
                  ellipsizeMode="middle"
                  style={[styles.valueText]}
                  color="live"
                >
                  { staked.nodeId }
                </LText>
              ),
            },
            {
              label: t("cosmos.delegation.drawer.status"),
              Component: (
                <LText
                  numberOfLines={1}
                  semiBold
                  ellipsizeMode="middle"
                  style={[styles.valueText]}
                  color="live"
                >
                  { t("cosmos.delegation.drawer.active") }
                </LText>
              ),
            },
            {
              label: t("cosmos.delegation.drawer.rewards"),
              Component: (
                <LText
                  numberOfLines={1}
                  semiBold
                  style={[styles.valueText]}
                >
                  {staked.pendingRewards ?? ""}
                </LText>
              ),
            },
 
          ]
        : [];
    }, [t, account]);
  
    const actions = useMemo<DelegationDrawerActions>(() => {  
      const redelegateEnabled = account.hederaResources.staked.accountId != null || account.hederaResources.staked.nodeId != null;
  
      const undelegationEnabled = account.hederaResources.staked.accountId != null || account.hederaResources.staked.nodeId != null;
  
      return [
        {
          label: t("delegation.actions.redelegate"),
          Icon: (props: IconProps) => (
            <Circle
              {...props}
              bg={!redelegateEnabled ? colors.lightFog : colors.fog}
            >
              <RedelegateIcon
                color={!redelegateEnabled ? colors.grey : undefined}
              />
            </Circle>
          ),
          disabled: !redelegateEnabled,
          onPress: onRedelegate,
          event: "DelegationActionRedelegate",
        },
        {
          label: t("delegation.actions.undelegate"),
          Icon: (props: IconProps) => (
            <Circle
              {...props}
              bg={
                !undelegationEnabled
                  ? colors.lightFog
                  : rgba(colors.alert, 0.2)
              }
            >
              <UndelegateIcon
                color={!undelegationEnabled ? colors.grey : undefined}
              />
            </Circle>
          ),
          disabled: !undelegationEnabled,
          onPress: onUndelegate,
          event: "DelegationActionUndelegate",
        },
      ];
    }, [
      account,
      t,
      onRedelegate,
      onUndelegate,
      colors.lightFog,
      colors.fog,
      colors.grey,
      colors.yellow,
      colors.alert,
    ]);
  
    const delegationDisabled = staked == null;
  
    return (
      <View style={styles.root}>
        <DelegationDrawer
          isOpen={data && data.length > 0}
          onClose={onCloseDrawer}
          account={account}
          ValidatorImage={({ size }) => (
            <Text>{staked.nodeId ? staked.nodeId : staked.accountId}</Text>
          )}
          amount={account.balance}
          data={data}
          actions={actions}
        />
        {staked.pendingRewards! > 0 && (
          <>
            <AccountSectionLabel name={t("account.claimReward.sectionLabel")} />
            <View style={[styles.rewardsWrapper]}>
              <View style={styles.column}>
                <Text fontWeight={"semiBold"} variant={"h4"}>
                  {staked.pendingRewards}
                </Text>
              </View>
            </View>
          </>
        )}
        {staked == null ? (
          <AccountDelegationInfo
            title={t("account.delegation.info.title")}
            image={<IlluRewards style={styles.illustration} />}
            description={t("cosmos.delegation.delegationEarn", {
              name: account.currency.name,
              ticker: account.currency.ticker,
            })}
            infoUrl={urls.cosmosStaking}
            infoTitle={t("cosmos.delegation.info")}
            onPress={onDelegate}
            ctaTitle={t("account.delegation.info.cta")}
          />
        ) : (
          <View style={styles.wrapper}>
            <View style={[styles.delegationsWrapper]}>
              <DelegationRow
                delegation={staked}
              />
            </View>
          </View>
        )}
  
        {/* {undelegations && undelegations.length > 0 && (
          <View style={styles.wrapper}>
            <AccountSectionLabel name={t("account.undelegation.sectionLabel")} />
            {undelegations.map((d, i) => (
              <View
                key={d.validatorAddress}
                style={[
                  styles.delegationsWrapper,
                  { backgroundColor: colors.card },
                ]}
              >
                <DelegationRow
                  delegation={d}
                  currency={currency}
                  onPress={() => setUndelegation(d)}
                  isLast={i === undelegations.length - 1}
                />
              </View>
            ))}
          </View>
        )} */}
      </View>
    );
  }
  
  export default function CosmosDelegations({
    account,
  }: {
    account: AccountLike;
  }) {
    if (!(account as HederaAccount).hederaResources) return null;
    return <Delegations account={account as HederaAccount} />;
  }
  
  const styles = StyleSheet.create({
    root: {
      marginHorizontal: 16,
    },
    illustration: { alignSelf: "center", marginBottom: 16 },
    rewardsWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center",
      paddingVertical: 16,
      marginBottom: 16,
  
      borderRadius: 4,
    },
    label: {
      fontSize: 20,
      flex: 1,
    },
    subLabel: {
      fontSize: 14,
  
      flex: 1,
    },
    column: {
      flexDirection: "column",
    },
    wrapper: {},
    delegationsWrapper: {
      borderRadius: 4,
    },
    valueText: {
      fontSize: 14,
    },
    banner: {
      marginBottom: 16,
    },
  });
  