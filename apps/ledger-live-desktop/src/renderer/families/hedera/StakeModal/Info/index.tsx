import React, { useCallback } from "react";
import { Account, AccountLike } from "@ledgerhq/types-live";
import { openModal, closeModal } from "~/renderer/actions/modals";
import EarnRewardsInfoModal from "~/renderer/components/EarnRewardsInfoModal";
import { useDispatch } from "react-redux";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import { Icons } from "@ledgerhq/react-ui";
import Button from "~/renderer/components/Button";
import Modal, { ModalBody } from "~/renderer/components/Modal";

type Props = {
    name?: string;
    account: AccountLike;
    parentAccount: Account | undefined | null;
};
export default function HederaEarnRewardsInfoModal ({ name, account, parentAccount }: Props) {
    const row = {
        borderBottom: "1px solid #3C3C3C",
        marginLeft: "16px",
        marginRight: "16px",
        paddingTop: "16px",
        paddingBottom: "16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "12px",
    };

    const lastRow = {
        marginLeft: "16px",
        marginRight: "16px",
        paddingTop: "16px",
        paddingBottom: "16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "12px",
    };

    const dispatch = useDispatch();

    const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
        openModal("MODAL_HEDERA_STAKE", {
        parentAccount,
        account,
        }),
    );
    }, [parentAccount, account, dispatch, name]);

    return (
        <Modal
        name={name}
        centered
        render={({ onClose }) => (
        <ModalBody
            title={<Trans i18nKey="delegation.earnRewards" />}
            onClose={onClose}
            render={() => (
                <Box>
                    <Box style={{ justifyContent: "center", textAlign: "center", display: "flex", flexDirection: "row",}}>
                        <Text ff="Inter|SemiBold" fontSize={24} lineHeight="135%" mb="32px" style={{width: "335px"}}>
                            <Trans i18nKey="hedera.stake.flow.info.title" />
                        </Text>
                    </Box>
                    <Box style={row}>
                        <Icons.NetworkWiredMedium size={24} color="#BBB0FF" />
                        <Text ff="Inter|SemiBold" fontSize={14} lineHeight="17px">
                        <Trans i18nKey="hedera.stake.flow.info.stake" />
                        </Text>
                    </Box>
                    <Box style={row}>
                        <Icons.UnlockMedium size={24} color="#BBB0FF" />
                        <Text ff="Inter|SemiBold" fontSize={14} lineHeight="17px">
                            <Trans i18nKey="hedera.stake.flow.info.noLock" />
                        </Text>
                    </Box>
                    <Box style={row}>
                        <Icons.CubeMedium size={24} color="#BBB0FF" />
                        <Text ff="Inter|SemiBold" fontSize={14} lineHeight="17px">
                            <Trans i18nKey="hedera.stake.flow.info.receive" />
                        </Text>
                    </Box>
                    <Box style={lastRow}>
                        <Icons.HandHoldingCoinMedium size={24} color="#BBB0FF" />
                        <Text ff="Inter|SemiBold" fontSize={14} lineHeight="17px">
                            <Trans i18nKey="hedera.stake.flow.info.donate" />
                        </Text>
                    </Box>
                </Box>
            )}
            renderFooter={() => (
                <Box style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: "0px", width: "100%", }}>
                <Button outline mr={1} secondary onClick={onClose}>
                    <Trans i18nKey="common.cancel" />
                </Button>
                <Button primary onClick={onNext}>
                    <Trans i18nKey="common.continue" />
                </Button>
            </Box>
            )}
            />
        )}
        />
    );
};