import {
  defaultUpdateTransaction,
  makeAccountBridgeReceive,
  makeScanAccounts,
} from "./jsHelpers";
import { SignerContext } from "@ledgerhq/coin-framework/signer";
import type { AccountBridge, CurrencyBridge } from "@ledgerhq/types-live";
import getAddressWrapper from "@ledgerhq/coin-framework/bridge/getAddressWrapper";
import type { KaspaAccount, KaspaTransaction, KaspaTransactionStatusCommon } from "../types/bridge";
import { estimateMaxSpendable } from "./estimateMaxSpendable";
import { getTransactionStatus } from "./getTransactionStatus";
import { getAccountShape, sync } from "./synchronization";
import { prepareTransaction } from "./prepareTransaction";
import { createTransaction } from "./createTransaction";
import { buildSignOperation } from "./signOperation";
import { initAccount } from "./initAccount";
import { KaspaSigner } from "../signer";
import { broadcast } from "./broadcast";
import resolver from "../hw-getAddress";
import {

} from "../serialization";

export function buildCurrencyBridge(signerContext: SignerContext<KaspaSigner>): CurrencyBridge {
  const getAddress = resolver(signerContext);

  const scanAccounts = makeScanAccounts({
    getAccountShape,
    getAddressFn: getAddress,
  });

  return {
    preload: async () => Promise.resolve({}),
    hydrate: () => {},
    scanAccounts,
  };
}

export function buildAccountBridge(
  signerContext: SignerContext<KaspaSigner>,
): AccountBridge<KaspaTransaction, KaspaAccount, KaspaTransactionStatusCommon> {
  const getAddress = resolver(signerContext);

  const receive = makeAccountBridgeReceive(getAddressWrapper(getAddress));
  const signOperation = buildSignOperation(signerContext);

  return {
    createTransaction,
    updateTransaction: defaultUpdateTransaction,
    prepareTransaction,
    getTransactionStatus,
    sync,
    receive,
    initAccount,
    signOperation,
    broadcast,
    estimateMaxSpendable,
  };
}

export function createBridges(signerContext: SignerContext<KaspaSigner>) {
  return {
    currencyBridge: buildCurrencyBridge(signerContext),
    accountBridge: buildAccountBridge(signerContext),
  };
}
