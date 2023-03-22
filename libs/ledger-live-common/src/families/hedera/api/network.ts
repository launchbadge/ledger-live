import BigNumber from "bignumber.js";
import type { Transaction as HederaTransaction, TransactionResponse } from "@hashgraph/sdk";
import {
  Client,
  TransferTransaction,
  Hbar,
  AccountId,
  TransactionId,
  AccountBalanceQuery,
  HbarUnit,
} from "@hashgraph/sdk";
import { Account } from "@ledgerhq/types-live";
import { Transaction } from "../types";
import { HederaAddAccountError } from "../errors";
import { STAKE_METHOD, STAKE_TYPE } from "../types";

export function broadcastTransaction(transaction: HederaTransaction): Promise<TransactionResponse> {
  return transaction.execute(getClient());
}

export async function buildUnsignedTransaction({
  account,
  transaction,
}: {
  account: Account;
  transaction: Transaction;
}): Promise<TransferTransaction> {
  const hbarAmount = Hbar.fromTinybars(transaction.amount);
  const accountId = account.freshAddress;

  return new TransferTransaction()
    .setNodeAccountIds([new AccountId(3)])
    .setTransactionId(TransactionId.generate(accountId))
    .setTransactionMemo(transaction.memo ?? "")
    .addHbarTransfer(accountId, hbarAmount.negated())
    .addHbarTransfer(transaction.recipient, hbarAmount)
    .freeze();
}

export async function buildUnsignedAccountUpdateTransaction({
  account,
  transaction,
}: {
  account: Account;
  transaction: Transaction;
}): Promise<hedera.AccountUpdateTransaction> {
  const accountId = account.freshAddress;

  const unsignedTx = new hedera.AccountUpdateTransaction()
    .setNodeAccountIds([new AccountId(3)])
    .setTransactionId(hedera.TransactionId.generate(accountId))
    .setAccountId(accountId);

  if (transaction.staked?.stakeType === STAKE_TYPE.STOP) {
    unsignedTx.clearStakedAccountId().clearStakedNodeId();
  } else {
    if (
      transaction.staked?.stakeMethod === STAKE_METHOD.ACCOUNT &&
      transaction.staked.accountId
    ) {
      unsignedTx.setStakedAccountId(transaction.staked.accountId);
    }

    if (
      transaction.staked?.stakeMethod === STAKE_METHOD.NODE &&
      transaction.staked.nodeId
    ) {
      unsignedTx.setStakedNodeId(transaction.staked.nodeId);
    }

    if (transaction.staked?.declineRewards != null) {
      unsignedTx.setDeclineStakingReward(transaction.staked?.declineRewards);
    }
  }

  return unsignedTx.freeze();
}

export interface AccountBalance {
  balance: BigNumber;
}

export async function getAccountBalance(address: string): Promise<AccountBalance> {
  const accountId = AccountId.fromString(address);
  let accountBalance;

  try {
    accountBalance = await new AccountBalanceQuery({
      accountId,
    }).execute(getBalanceClient());
  } catch {
    throw new HederaAddAccountError();
  }

  return {
    balance: accountBalance.hbars.to(HbarUnit.Tinybar),
  };
}

let _hederaClient: Client | null = null;

let _hederaBalanceClient: Client | null = null;

function getClient(): Client {
  _hederaClient ??= Client.forMainnet().setMaxNodesPerTransaction(1);

  //_hederaClient.setNetwork({ mainnet: "https://hedera.coin.ledger.com" });

  return _hederaClient;
}

function getBalanceClient(): Client {
  _hederaBalanceClient ??= Client.forMainnet();

  return _hederaBalanceClient;
}
