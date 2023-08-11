import React, { useCallback, useEffect, useState } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { Account } from "@ledgerhq/types-live";
import { getAccountUnit } from "@ledgerhq/live-common/account/index";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { Header } from "./Header";
import { Row } from "./Row";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";
import { HederaAccount } from "@ledgerhq/live-common/families/hedera/types";
import { getNodeList } from "@ledgerhq/live-common/families/hedera/api/mirror";
import { Node } from "@ledgerhq/live-common/families/hedera/api/types";


type Props = {
  account: Account;
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
}))`
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

const Delegation = ({ account }: Props) => {
  const dispatch = useDispatch();
  const { hederaResources } = account as HederaAccount;
  invariant(hederaResources, "hedera account expected");
  const {
    staked
  } = hederaResources;
//   const delegationEnabled = canDelegate(account);
  const currencyId = account.currency.id;
//   const { validators } = useCosmosFamilyPreloadData(currencyId);
  const unit = getAccountUnit(account);
//   const mappedUnbondings = mapUnbondings(unbondings, validators, unit);
//   const onEarnRewards = useCallback(() => {
//     dispatch(
//       openModal("MODAL_COSMOS_REWARDS_INFO", {
//         account,
//       }),
//     );
//   }, [account, dispatch]);
  // const onDelegate = useCallback(() => {
  //   dispatch(
  //     openModal("MODAL_COSMOS_DELEGATE", {
  //       account,
  //     }),
  //   );
  // }, [account, dispatch]);
//   const onClaimRewards = useCallback(() => {
//     dispatch(
//       openModal("MODAL_COSMOS_CLAIM_REWARDS", {
//         account,
//       }),
//     );
//   }, [account, dispatch]);
  const onRedirect = useCallback(
    (modalName: string) => {
      const stakeType = modalName == "MODAL_HEDERA_STAKE" ? "new" : "change";
      dispatch(
        openModal(modalName, {
          account,
          stakeType,
        }),
      );
    },
    [account, dispatch],
  );
//   const explorerView = getDefaultExplorerView(account.currency);
//   const onExternalLink = useCallback(
//     (address: string) => {
//       if (cosmosBase.COSMOS_FAMILY_LEDGER_VALIDATOR_ADDRESSES.includes(address)) {
//         openURL(urls.ledgerValidator);
//       } else {
//         const srURL = explorerView && getAddressExplorer(explorerView, address);
//         if (srURL) openURL(srURL);
//       }
//     },
//     [explorerView],
//   );
  const hasDelegations = staked.accountId != null || staked.nodeId != null;

  return (
    <>
      <TableContainer mb={6}>
        <TableHeader
          title={<Trans i18nKey="cosmos.delegation.header" />}
          titleProps={{
            "data-e2e": "title_Delegation",
          }}
        >
        </TableHeader>
        {hasDelegations ? (
          <>
            <Header />
              <Row
                account={account as HederaAccount}
                delegation={staked}
                onManageAction={onRedirect}
                // onExternalLink={onExternalLink}
              />
          </>
        ) : (
          <Wrapper horizontal>
            <Box
              style={{
                maxWidth: "65%",
              }}
            >
              <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
                <Trans
                  i18nKey="cosmos.delegation.emptyState.description"
                  values={{
                    name: account.currency.name,
                    currencyTicker: account.currency.ticker,
                  }}
                />
              </Text>
              <Box mt={2}>
                <LinkWithExternalIcon
                  label={<Trans i18nKey="cosmos.delegation.emptyState.info" />}
                  onClick={() => openURL(urls.hedera.staking)}
                />
              </Box>
            </Box>
          </Wrapper>
        )}
      </TableContainer>
    </>
  );
};
const Delegations = ({ account }: Props) => {
  if (!(account as HederaAccount).hederaResources) return null;
  return <Delegation account={account} />;
};
export default Delegations;
