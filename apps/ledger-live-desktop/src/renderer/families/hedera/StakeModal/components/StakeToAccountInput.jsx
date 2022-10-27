// @flow

import React from "react";
import { Trans } from "react-i18next";
import { RecipientRequired } from "@ledgerhq/errors";

import Label from "~/renderer/components/Label";
import RecipientAddress from "~/renderer/components/RecipientAddress";

type Props = {
  account: Account,
  status: TransactionStatus,
  value: string,
  onChange: () => void,
  t: TFunction,
};

const StakeToAccountInput = ({ account, status, value, onChange, t }: Props) => {
  if (!status) return null;
  const { stakeInput: stakeInputError } = status.errors;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      <Label style={{ marginRight: 10 }}>
        <Trans i18nKey="hedera.common.account" />
      </Label>
      <RecipientAddress
        placeholder={t("RecipientField.placeholder", { currencyName: account.currency.name })}
        withQrCode={false}
        error={stakeInputError instanceof RecipientRequired ? null : stakeInputError}
        value={value}
        onChange={onChange}
        id={"account-stake-input"}
      />
    </div>
  );
};

export default StakeToAccountInput;
