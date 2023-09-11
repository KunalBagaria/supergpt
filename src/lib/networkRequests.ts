import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { Message } from "./interfaces";
import { WalletAdapterProps } from "@solana/wallet-adapter-base";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { USDC_ADDRESS } from "./constants";

async function handleRegisterRequest(address: string, signature: Uint8Array) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      signature,
    }),
  });
  const data = await res.json();
  return data;
}

async function handleSendMessageRequest(
  address: string,
  signature: Uint8Array,
  model: string,
  messages: Message[]
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      signature,
      model,
      messages,
    }),
  });
  const data = await res.json();
  return data;
}

async function handleBuyCreditsRequest(
  address: string,
  signature: Uint8Array,
  credits: number,
  publicKey: PublicKey,
  sendTransaction: WalletAdapterProps["sendTransaction"],
  connection: Connection,
  vaultAddress: string
) {
  const userATA = getAssociatedTokenAddressSync(
    new PublicKey(USDC_ADDRESS),
    publicKey
  );
  const valutATA = getAssociatedTokenAddressSync(
    new PublicKey(USDC_ADDRESS),
    new PublicKey(vaultAddress)
  );

  const depositTx = new Transaction().add(
    createTransferCheckedInstruction(
      userATA,
      new PublicKey(USDC_ADDRESS),
      valutATA,
      publicKey,
      credits * 0.001 * 10 ** 6,
      6
    )
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  const depositTxSig = await sendTransaction(depositTx, connection);

  await connection.confirmTransaction(
    {
      signature: depositTxSig,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    "confirmed"
  );

  const res = await fetch("/api/buy-credits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      signature,
      credits,
      txSig: depositTxSig,
    }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error("Failed to buy credits");
  }
  return data;
}

async function getUser(address: string) {
  const res = await fetch(`/api/get-user?address=${address}`);
  const data = await res.json();
  return data;
}

export {
  handleRegisterRequest,
  handleSendMessageRequest,
  handleBuyCreditsRequest,
  getUser,
};
