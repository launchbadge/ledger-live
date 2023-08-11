import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import moment from "moment";
import {
  HederaAccount,
  HederaStake,
  StakeType
} from "@ledgerhq/live-common/families/hedera/types";
import { Account } from "@ledgerhq/types-live";
import {
  canRedelegate,
  canUndelegate,
  getRedelegationCompletionDate,
} from "@ledgerhq/live-common/families/cosmos/logic";
import { TableLine } from "./Header";
import DropDown, { DropDownItem } from "~/renderer/components/DropDownSelector";
import Box from "~/renderer/components/Box/Box";
import ChevronRight from "~/renderer/icons/ChevronRight";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import ToolTip from "~/renderer/components/Tooltip";
import CosmosFamilyLedgerValidatorIcon from "~/renderer/families/cosmos/shared/components/CosmosFamilyLedgerValidatorIcon";
import Text from "~/renderer/components/Text";
import { Node } from "@ledgerhq/live-common/families/hedera/api/types";
import { getNodeList } from "@ledgerhq/live-common/families/hedera/api/mirror";


export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
`;
export const Column: ThemedComponent<{
  clickable?: boolean;
}> = styled(TableLine).attrs(p => ({
  ff: "Inter|SemiBold",
  color: p.strong ? "palette.text.shade100" : "palette.text.shade80",
  fontSize: 3,
}))`
  cursor: ${p => (p.clickable ? "pointer" : "cursor")};
  ${p =>
    p.clickable
      ? `
    &:hover {
      color: ${p.theme.colors.palette.primary.main};
    }
    `
      : ``}
`;
export const Ellipsis = styled.div`
  flex: 1;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin-bottom: ${p => p.theme.space[1]}px;
  background-color: ${p => p.theme.colors.palette.divider};
`;
export const ManageDropDownItem = ({
  item,
  isActive,
}: {
  item: {
    label: string;
    disabled: boolean;
    tooltip: React.ReactNode;
  };
  isActive: boolean;
}) => {
  return (
    <>
      <ToolTip
        content={item.tooltip}
        containerStyle={{
          width: "100%",
        }}
      >
        <DropDownItem disabled={item.disabled} isActive={isActive}>
          <Box horizontal alignItems="center" justifyContent="center">
            <Text ff="Inter|SemiBold">{item.label}</Text>
          </Box>
        </DropDownItem>
      </ToolTip>
    </>
  );
};
type Props = {
  account: HederaAccount;
  delegation: HederaStake;
  onManageAction: (
    action: "MODAL_HEDERA_STAKE" | "MODAL_HEDERA_STOP_STAKING",
  ) => void;
  // onExternalLink: (address: string) => void;
};
export function Row({
  account,
  delegation: {
    stakeType,
    stakeMethod,
  
    accountId,
    nodeId,
    declineRewards,
    pendingRewards,
  },
  onManageAction,
}: Props) {
  const [nodeDescription, setNodeDescription] = useState("")

  useEffect(() => {
    async function getNodeListState() {
      // fetch list of stake-able nodes
      const nodeList = await getNodeList();

      const description = nodeList.find(node => node.node_id === nodeId)?.description;

      if (description != undefined) {
        setNodeDescription(description.replace("Hosted by ", ""));
      }
    }
    if (!nodeDescription) {
      getNodeListState();
    }
  });

  const onSelect = useCallback(
    action => {
      onManageAction(action.key);
    },
    [onManageAction],
  );
  const _canUndelegate = account.hederaResources.staked.accountId != null || account.hederaResources.staked.nodeId != null;
  const _canRedelegate = account.hederaResources.staked.accountId != null || account.hederaResources.staked.nodeId != null;
  const dropDownItems = useMemo(
    () => [
      {    // result.map(node => ({
        //   description: node.description,
        //   label: node.node_account_id,
        //   value: node.node_id,
        //   stake: node.stake,
        //   rewarding: node.stake > node.min_stake
        // }))
        key: "MODAL_HEDERA_STAKE",
        label: <Trans i18nKey="hedera.stake.stepperHeader.changeStake" />,
        disabled: !_canRedelegate,
        tooltip: !_canRedelegate ?
          (
            <Trans i18nKey="cosmos.delegation.redelegateMaxDisabledTooltip">
              <b></b>
            </Trans>
          )
        : null,
      },
      {
        key: "MODAL_HEDERA_STOP_STAKING",
        label: <Trans i18nKey="hedera.stake.stepperHeader.stopStake" />,
        disabled: !_canUndelegate,
        tooltip: !_canUndelegate ? (
          <Trans i18nKey="cosmos.delegation.undelegateDisabledTooltip">
            <b></b>
          </Trans>
        ) : null,
      },
    ],
    [pendingRewards, _canRedelegate, _canUndelegate],
  );
  // fetch list of stake-able nodes
  // const nodeDescription = nodeList.find(node => node.node_id === nodeId)?.description;
  // console.log(nodeDescription);
  // const name = accountId ? accountId : nodeId ? nodeDescription : null;
  // console.log("node id: " + nodeId);
  // const onExternalLinkClick = useCallback(() => onExternalLink(validatorAddress), [
  //   onExternalLink,
  //   validatorAddress,
  // ]);
  return (
    <Wrapper>
      <Column strong>
        <Ellipsis>{nodeDescription}</Ellipsis>
      </Column>
      <Column>
        <Box color="positiveGreen" pl={2}>
          <ToolTip content={<Trans i18nKey="cosmos.delegation.activeTooltip" />}>
            <CheckCircle size={14} />
          </ToolTip>
        </Box>
      </Column>
      {/* <Column>{formattedAmount}</Column> */}
      {/* <Column>{formattedPendingRewards}</Column> */}

      <Column>{pendingRewards}</Column>
      <Column>
        <DropDown
          items={dropDownItems}
          renderItem={({ item, isActive }) => {
            return <ManageDropDownItem item={item} isActive={isActive} />;
          }}
          onChange={onSelect}
        >
          {() => (
            <Box flex horizontal alignItems="center">
              <Trans i18nKey="common.manage" />
              <div
                style={{
                  transform: "rotate(90deg)",
                }}
              >
                <ChevronRight size={16} />
              </div>
            </Box>
          )}
        </DropDown>
      </Column>
    </Wrapper>
  );
}
