import { Box } from "@ledgerhq/react-ui";
import { Account } from "@ledgerhq/types-live";
import React from "react";
import { Trans } from "react-i18next";
import Text from "../../components/Text";
import { OpDetailsSection } from "~/renderer/drawers/OperationDetails/styledComponents";

type OperationDetailsExtraProps = {
    extra: {
        [key: string]: any;
    };
    type: string;
    account: Account;
};

const OperationDetailsExtra = ({ type }: OperationDetailsExtraProps) => {
    if (type === "UPDATE_ACCOUNT") {
        return (
            <>
                <OpDetailsSection>
                    <Trans i18nKey={"operationDetails.extra.updateAccount"} />
                </OpDetailsSection>
            </>
        );
    }
}

export default {
    OperationDetailsExtra,
};