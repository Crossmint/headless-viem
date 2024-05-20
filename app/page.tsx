"use client";

import { createWalletClient, custom, walletActions } from "viem";
import { sepolia } from "viem/chains";

export default function Home() {
  const client =
    typeof window !== "undefined"
      ? createWalletClient({
          account: "0x6C3b3225759Cbda68F96378A9F0277B4374f9F06",
          chain: sepolia,
          transport: custom(window.ethereum!),
        })
      : null;

  const sendSerializedTransaction = async () => {
    // const serializedTransaction =
    //   "0x02f9012683aa36a744848917370085080992ce6c82629c94a105c311fa72b8fb78c992ecbdb8b02ea5bd394d869a9d359ca000b8f465794a68624763694f694a49557a49314e694973496e523563434936496b705856434a392e65794a756232356a5a534936496a4d3559544e6d4d444d334c544d7a4e6d51744e4441305a5331684d6a45774c575268593249335957526b5a4456694e794973496d39795a4756795357526c626e52705a6d6c6c63694936496d4e6a4e44426c4e6d466d4c5759345a474d744e47466a4d6930345a5449324c5751354d57457a4d6d59794e7a466a5a694973496d6c68644349364d5463784e546b334f54557a4e33302e662d4949646c653375314c58634c7845765438754e336d74786370764a686f31384a5a4b76483768456659c0";

    const request = await client?.prepareTransactionRequest({
      to: "0xa105C311fA72b8Fb78c992EcbDb8b02Ea5bd394d",
      data: "0x65794a68624763694f694a49557a49314e694973496e523563434936496b705856434a392e65794a756232356a5a534936496a4d3559544e6d4d444d334c544d7a4e6d51744e4441305a5331684d6a45774c575268593249335957526b5a4456694e794973496d39795a4756795357526c626e52705a6d6c6c63694936496d4e6a4e44426c4e6d466d4c5759345a474d744e47466a4d6930345a5449324c5751354d57457a4d6d59794e7a466a5a694973496d6c68644349364d5463784e546b334f54557a4e33302e662d4949646c653375314c58634c7845765438754e336d74786370764a686f31384a5a4b76483768456659",
      gasLimit: "25244",
      maxPriorityFeePerGas: BigInt(2300000000),
      maxFeePerGas: BigInt(34520354412),
      value: BigInt(170000000000000),
      chainId: 11155111,
      sig: null,
      accessList: [],
    });
    // removed gasPrice and nonce

    const serializedTransaction = await client.signTransaction(request);

    const hash = await client.sendRawTransaction({
      serializedTransaction,
    });

    console.log(hash);
  };

  return (
    <button onClick={() => sendSerializedTransaction()}>
      Send Serialized transaction
    </button>
  );
}
