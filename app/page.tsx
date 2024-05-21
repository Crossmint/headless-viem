"use client";

import { useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  parseTransaction,
  custom,
  http,
  type Address,
  type Hash,
  type TransactionReceipt,
  stringify,
} from "viem";
import { sepolia } from "viem/chains";

declare global {
  interface Window {
    ethereum: any;
  }
}

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export default function Home() {
  const [hash, setHash] = useState<Hash>();
  const [account, setAccount] = useState<Address | "">("");
  const [receipt, setReceipt] = useState<TransactionReceipt>();
  const [client, setClient] = useState<any>();
  const [serializedTxn, setSerializedTxn] = useState<`0x${string}`>();

  useEffect(() => {
    const client = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });
    setClient(client);
  }, []);

  useEffect(() => {
    (async () => {
      if (hash) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });
        setReceipt(receipt);
      }
    })();
  }, [hash]);

  const connectWallet = async () => {
    const accounts = await client.requestAddresses();
    setAccount(accounts[0]);
  };

  const signAndSendTransaction = async () => {
    const txn = parseTransaction(serializedTxn || "0x");

    const hash = await client?.sendTransaction({
      account,
      to: txn.to,
      data: txn.data,
      value: BigInt(txn.value || 0),
      chainId: txn.chainId,
    });

    setHash(hash);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between gap-2 mb-2">
        <input
          value={account}
          onChange={(e) => setAccount(e.target.value as `0x${string}`)}
          placeholder="Enter Wallet Address or click Connect Wallet Button"
          className="w-full px-3 py-2 font-mono text-sm text-gray-700 placeholder-gray-300 rounded focus:outline-none"
        />
        <button
          onClick={() => connectWallet()}
          disabled={!!account}
          className={`bg-gradient-to-br from-[#01b15d] to-[#0296a8] hover:bg-gradient-to-br hover:from-[#00ff85] hover:to-[#00e1fc] text-white font-bold py-2 px-4 rounded w-60 ${
            account ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Connect Wallet
        </button>
      </div>
      <textarea
        value={serializedTxn}
        onChange={(e) => setSerializedTxn(e.target.value as `0x${string}`)}
        placeholder="Enter serializedTransaction from API response"
        className="w-full h-40 px-3 py-2 font-mono text-sm text-gray-700 placeholder-gray-300 rounded focus:outline-none"
      />
      <div className="flex justify-between gap-2 mb-2">
        <button
          onClick={() => signAndSendTransaction()}
          disabled={!serializedTxn}
          className={`bg-gradient-to-br from-[#01b15d] to-[#0296a8] hover:bg-gradient-to-br hover:from-[#00ff85] hover:to-[#00e1fc] text-white font-bold py-2 px-4 rounded ${
            !serializedTxn ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Send Transaction
        </button>
        {hash && !receipt && (
          <div className="pt-5">
            Awaiting confirmation...<div className="ml-3 spinner"></div>
          </div>
        )}
      </div>
      {receipt && (
        <div className="p-2 bg-gray-900 overflow-auto rounded">
          Receipt:{" "}
          <pre>
            <code>{stringify(receipt, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
