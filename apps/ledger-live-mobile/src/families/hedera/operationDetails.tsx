import type { Account, OperationType, Operation } from "@ledgerhq/types-live";
import Section from "../../screens/OperationDetails/Section";
import { useTranslation, Trans } from "react-i18next";

type OperationDetailsExtraProps = {
    extra: {
        [key: string]: any;
    };
    type: string;
    account: Account;
};

const OperationDetailsExtra = ({ type }: OperationDetailsExtraProps) => {
    const { t } = useTranslation();
    
    if (type === "UPDATE_ACCOUNT") {
        return (
            <>
                <Section
                    title={t("operationDetails.extra.delegatedTo")}
                    value={t("operationDetails.extra.updateAccount")}
                />
            </>
        );
    }
}

export default {
    OperationDetailsExtra,
};