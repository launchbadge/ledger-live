import {
  AminoMsgBeginRedelegate,
  AminoMsgDelegate,
  AminoMsgSend,
  AminoMsgUndelegate,
  AminoMsgWithdrawDelegatorReward,
} from "@cosmjs/stargate";
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { TxBody, TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { cosmos } from "@keplr-wallet/cosmos";
import { PubKey } from "@keplr-wallet/proto-types/cosmos/crypto/secp256k1/keys";
import { AuthInfo, Fee } from "@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx";
import type { Account } from "@ledgerhq/types-live";
import { Transaction } from "./types";
import { AminoMsg, Coin } from "@cosmjs/amino";

type ProtoMsg = {
  typeUrl: string;
  value: Uint8Array;
};

export interface AminoZenrockMsgDelegate extends AminoMsg {
  readonly type: "zrchain/MsgDelegate";
  readonly value: {
    readonly delegator_address: string;
    readonly validator_address: string;
    readonly amount: Coin;
  };
}

export interface AminoZenrockMsgBeginRedelegate extends AminoMsg {
  readonly type: "zrchain/MsgBeginRedelegate";
  readonly value: {
    readonly delegator_address: string;
    readonly validator_src_address: string;
    readonly validator_dst_address: string;
    readonly amount: Coin;
  };
}

export interface AminoZenrockMsgUndelegate extends AminoMsg {
  readonly type: "zrchain/MsgUndelegate";
  readonly value: {
    readonly delegator_address: string;
    readonly validator_address: string;
    readonly amount: Coin;
  };
}

export const txToMessages = (
  account: Account,
  transaction: Transaction,
): { aminoMsgs: AminoMsg[]; protoMsgs: ProtoMsg[] } => {
  const aminoMsgs: Array<AminoMsg> = [];
  const protoMsgs: Array<ProtoMsg> = [];
  switch (transaction.mode) {
    case "send":
      if (transaction.recipient && transaction.amount.gt(0)) {
        const aminoMsg: AminoMsgSend = {
          type: "cosmos-sdk/MsgSend",
          value: {
            from_address: account.freshAddress,
            to_address: transaction.recipient,
            amount: [
              {
                denom: account.currency.units[1].code,
                amount: transaction.amount.toFixed(),
              },
            ],
          },
        };
        aminoMsgs.push(aminoMsg);

        // PROTO MESSAGE
        protoMsgs.push({
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: cosmos.bank.v1beta1.MsgSend.encode({
            fromAddress: account.freshAddress,
            toAddress: transaction.recipient,
            amount: [
              {
                denom: account.currency.units[1].code,
                amount: transaction.amount.toFixed(),
              },
            ],
          }).finish(),
        });
      }
      break;
    case "delegate":
      if (transaction.validators && transaction.validators.length > 0) {
        const validator = transaction.validators[0];
        if (validator && validator.address && transaction.amount.gt(0)) {
          const aminoMsg: AminoMsgDelegate | AminoZenrockMsgDelegate = {
            type:
              account.currency.id === "zenrock" ? "zrchain/MsgDelegate" : "cosmos-sdk/MsgDelegate",
            value: {
              delegator_address: account.freshAddress,
              validator_address: validator.address,
              amount: {
                denom: account.currency.units[1].code,
                amount: transaction.amount.toFixed(),
              },
            },
          };
          aminoMsgs.push(aminoMsg);

          // PROTO MESSAGE
          protoMsgs.push({
            typeUrl:
              account.currency.id === "zenrock"
                ? "/zrchain.validation.MsgDelegate"
                : "/cosmos.staking.v1beta1.MsgDelegate",
            value: MsgDelegate.encode({
              delegatorAddress: account.freshAddress,
              validatorAddress: validator.address,
              amount: {
                denom: account.currency.units[1].code,
                amount: transaction.amount.toFixed(),
              },
            }).finish(),
          });
        }
      }
      break;

    case "redelegate":
      if (
        transaction.sourceValidator &&
        transaction.validators &&
        transaction.validators.length > 0 &&
        transaction.validators[0].address &&
        transaction.validators[0].amount.gt(0)
      ) {
        const validator = transaction.validators[0];
        const aminoMsg: AminoMsgBeginRedelegate | AminoZenrockMsgBeginRedelegate = {
          type:
            account.currency.id === "zenrock"
              ? "zrchain/MsgBeginRedelegate"
              : "cosmos-sdk/MsgBeginRedelegate",
          value: {
            delegator_address: account.freshAddress,
            validator_src_address: transaction.sourceValidator,
            validator_dst_address: validator.address,
            amount: {
              denom: account.currency.units[1].code,
              amount: validator.amount.toFixed(),
            },
          },
        };
        aminoMsgs.push(aminoMsg);

        // PROTO MESSAGE
        protoMsgs.push({
          typeUrl:
            account.currency.id === "zenrock"
              ? "/zrchain.validation.MsgBeginRedelegate"
              : "/cosmos.staking.v1beta1.MsgBeginRedelegate",
          value: MsgBeginRedelegate.encode({
            delegatorAddress: account.freshAddress,
            validatorSrcAddress: transaction.sourceValidator,
            validatorDstAddress: validator.address,
            amount: {
              denom: account.currency.units[1].code,
              amount: validator.amount.toFixed(),
            },
          }).finish(),
        });
      }
      break;

    case "undelegate":
      if (transaction.validators && transaction.validators.length > 0) {
        const validator = transaction.validators[0];
        if (validator && validator.address && validator.amount.gt(0)) {
          const aminoMsg: AminoMsgUndelegate | AminoZenrockMsgUndelegate = {
            type:
              account.currency.id === "zenrock"
                ? "zrchain/MsgUndelegate"
                : "cosmos-sdk/MsgUndelegate",
            value: {
              delegator_address: account.freshAddress,
              validator_address: validator.address,
              amount: {
                denom: account.currency.units[1].code,
                amount: validator.amount.toFixed(),
              },
            },
          };
          aminoMsgs.push(aminoMsg);

          // PROTO MESSAGE
          protoMsgs.push({
            typeUrl:
              account.currency.id === "zenrock"
                ? "/zrchain.validation.MsgUndelegate"
                : "/cosmos.staking.v1beta1.MsgUndelegate",
            value: MsgUndelegate.encode({
              delegatorAddress: account.freshAddress,
              validatorAddress: validator.address,
              amount: {
                denom: account.currency.units[1].code,
                amount: validator.amount.toFixed(),
              },
            }).finish(),
          });
        }
      }
      break;
    case "claimReward":
      if (
        transaction.validators &&
        transaction.validators.length > 0 &&
        transaction.validators[0].address
      ) {
        const validator = transaction.validators[0];
        const aminoMsg: AminoMsgWithdrawDelegatorReward = {
          type: "cosmos-sdk/MsgWithdrawDelegationReward",
          value: {
            delegator_address: account.freshAddress,
            validator_address: validator.address,
          },
        };
        aminoMsgs.push(aminoMsg);

        // PROTO MESSAGE
        protoMsgs.push({
          typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
          value: MsgWithdrawDelegatorReward.encode({
            delegatorAddress: account.freshAddress,
            validatorAddress: validator.address,
          }).finish(),
        });
      }
      break;
    case "claimRewardCompound":
      if (
        transaction.validators &&
        transaction.validators.length > 0 &&
        transaction.validators[0].address &&
        transaction.validators[0].amount.gt(0)
      ) {
        const validator = transaction.validators[0];
        // AMINO MESSAGES
        const aminoWithdrawRewardMsg: AminoMsgWithdrawDelegatorReward = {
          type: "cosmos-sdk/MsgWithdrawDelegationReward",
          value: {
            delegator_address: account.freshAddress,
            validator_address: validator.address,
          },
        };
        const aminoDelegateMsg: AminoMsgDelegate | AminoZenrockMsgDelegate = {
          type:
            account.currency.id === "zenrock" ? "zrchain/MsgDelegate" : "cosmos-sdk/MsgDelegate",
          value: {
            delegator_address: account.freshAddress,
            validator_address: validator.address,
            amount: {
              denom: account.currency.units[1].code,
              amount: validator.amount.toFixed(),
            },
          },
        };
        aminoMsgs.push(aminoWithdrawRewardMsg, aminoDelegateMsg);

        // PROTO MESSAGES
        protoMsgs.push({
          typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
          value: MsgWithdrawDelegatorReward.encode({
            delegatorAddress: account.freshAddress,
            validatorAddress: validator.address,
          }).finish(),
        });
        protoMsgs.push({
          typeUrl:
            account.currency.id === "zenrock"
              ? "/zrchain.validation.MsgDelegate"
              : "/cosmos.staking.v1beta1.MsgDelegate",
          value: MsgDelegate.encode({
            delegatorAddress: account.freshAddress,
            validatorAddress: validator.address,
            amount: {
              denom: account.currency.units[1].code,
              amount: validator.amount.toFixed(),
            },
          }).finish(),
        });
      }
      break;
  }
  return { aminoMsgs, protoMsgs };
};

export const buildTransaction = ({
  protoMsgs,
  memo,
  pubKeyType,
  pubKey,
  feeAmount,
  gasLimit,
  sequence,
  signature,
}: {
  protoMsgs: Array<ProtoMsg>;
  memo: string;
  pubKeyType: string;
  pubKey: string;
  feeAmount: { amount: string; denom: string }[] | undefined;
  gasLimit: string | undefined;
  sequence: string | number;
  signature: Uint8Array;
}): Uint8Array => {
  const signedTx = TxRaw.encode({
    bodyBytes: TxBody.encode(
      TxBody.fromPartial({
        messages: protoMsgs,
        memo,
        timeoutHeight: undefined,
        extensionOptions: [],
        nonCriticalExtensionOptions: [],
      }),
    ).finish(),
    authInfoBytes: AuthInfo.encode({
      signerInfos: [
        {
          publicKey: {
            typeUrl: pubKeyType,
            value: PubKey.encode({
              key: Buffer.from(pubKey, "base64"),
            }).finish(),
          },
          modeInfo: {
            single: {
              mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
            },
            multi: undefined,
          },
          sequence: sequence.toString(),
        },
      ],
      fee: Fee.fromPartial({
        amount: feeAmount,
        gasLimit: gasLimit,
      }),
    }).finish(),
    signatures: [signature],
  }).finish();

  return signedTx;
};
