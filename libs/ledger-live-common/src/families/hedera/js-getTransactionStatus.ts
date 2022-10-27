import {
    AmountRequired,
    NotEnoughBalance,
    InvalidAddress,
    InvalidAddressBecauseDestinationIsAlsoSource,
    RecipientRequired
} from "@ledgerhq/errors";
import { AccountId } from "@hashgraph/sdk";
import { BigNumber } from "bignumber.js";

import { calculateAmount, estimatedFees } from "./utils";
import { STAKE_METHOD } from "./types";

import type { Transaction, TransactionStatus } from "./types";
import type { Account } from "@ledgerhq/types-live";

export default async function getTransactionStatus(
    account: Account,
    transaction: Transaction
): Promise<TransactionStatus> {
    const errors: Record<string, Error> = {};
    let amount = new BigNumber(0);
    let totalSpent = new BigNumber(0);

    /**
     * STAKE
     */

    if (transaction.mode === "stake") {
        if (transaction.staked?.stakeMethod === STAKE_METHOD.ACCOUNT) {
            if (
                !transaction.staked?.accountId ||
                transaction.staked?.accountId.length === 0
            ) {
                errors.stakeInput = new RecipientRequired("");
            } else {
                try {
                    AccountId.fromString(transaction.staked?.accountId);
                } catch (err) {
                    errors.stakeInput = new InvalidAddress("", {
                        currencyName: account.currency.name
                    });
                }
            }
        }

        if (transaction.staked?.stakeMethod === STAKE_METHOD.NODE) {
            if (transaction.staked?.nodeId == null) {
                errors.stakeInput = new RecipientRequired("");
            }
        }
    } else {
        /**
         * SEND
         */

        if (!transaction.recipient || transaction.recipient.length === 0) {
            errors.recipient = new RecipientRequired("");
        } else {
            if (account.freshAddress === transaction.recipient) {
                errors.recipient =
                    new InvalidAddressBecauseDestinationIsAlsoSource("");
            }

            try {
                AccountId.fromString(transaction.recipient);
            } catch (err) {
                errors.recipient = new InvalidAddress("", {
                    currencyName: account.currency.name
                });
            }
        }

        const calculatedAmount = await calculateAmount({
            transaction,
            account
        });
        amount = calculatedAmount.amount;
        totalSpent = calculatedAmount.totalSpent;

        if (transaction.amount.eq(0) && !transaction.useAllAmount) {
            errors.amount = new AmountRequired();
        } else if (account.balance.isLessThan(totalSpent)) {
            errors.amount = new NotEnoughBalance("");
        }
    }

    return {
        amount,
        errors,
        estimatedFees,
        totalSpent,
        warnings: {}
    };
}
