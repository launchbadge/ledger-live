import React from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import { Text } from "@ledgerhq/native-ui";
import Clipboard from "@react-native-community/clipboard";

import RecipientInput from "../../../../components/RecipientInput";

type Props = {
  value: string;
  onChange: (_: string) => void;
};

function StakeToAccountInput({ onChange, value }: Props) {
  return (
    <>
      {/* TODO: check Send flow to add error handling */}
      {/* src/screens/SendFunds/02-SelectRecipient.tsx */}
      {/* Look under <RecipientInput> usage */}
      <RecipientInput
        onPaste={async () => {
          const pastedText = await Clipboard.getString();
          onChange(pastedText);
        }}
        onChangeText={onChange}
        value={value}
      />
    </>
  );
}

export default StakeToAccountInput;
