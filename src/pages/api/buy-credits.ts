import { candypay } from "@/lib/candypay";
import { USDC_ADDRESS } from "@/lib/constants";
import { authenticate, verifyKeys, verifyMethod } from "@/lib/server";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, PublicKey, TransactionResponse } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!verifyMethod(req, res, "POST")) return;
    const requiredKeys = ["address", "signature", "credits", "txSig"];
    if (!verifyKeys(req, res, requiredKeys)) return;
    const { address, signature, credits, txSig } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: address },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User does not exist" });
      return;
    }
    const authenticated = authenticate(address, signature, res);
    if (!authenticated) return;

    // const response = await candypay.session.create({
    //   success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    //   items: [
    //     {
    //       name: `${credits} credits`,
    //       // price in USD
    //       price: 0.1,
    //       image: "https://imgur.com/M0l5SDh.png",
    //       quantity: credits,
    //     },
    //   ],
    // });

    const connection = new Connection(process.env.RPC as string, "confirmed");

    const tx = (await connection.getTransaction(txSig, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 2,
    })) as TransactionResponse;

    if (!tx) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction: tx not found",
      });
    }

    if (!tx.meta) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction: tx meta not found",
      });
    }

    const vaultATA = getAssociatedTokenAddressSync(
      new PublicKey(USDC_ADDRESS),
      new PublicKey(process.env.NEXT_PUBLIC_VAULT_ADDRESS as string)
    );

    const vaultAccountIndex = tx.transaction.message.accountKeys.findIndex(
      (account) => account.toString() === vaultATA.toString()
    );

    if (vaultAccountIndex < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction: vault account not found",
      });
    }

    const { postTokenBalances, preTokenBalances } = tx.meta;

    const vaultPreTokenBalance = preTokenBalances?.find(
      (balance) =>
        balance.accountIndex === vaultAccountIndex &&
        balance.mint === USDC_ADDRESS
    );

    const vaultPostTokenBalance = postTokenBalances?.find(
      (balance) =>
        balance.accountIndex === vaultAccountIndex &&
        balance.mint === USDC_ADDRESS
    );

    if (
      !vaultPreTokenBalance?.uiTokenAmount?.uiAmount ||
      !vaultPostTokenBalance?.uiTokenAmount?.uiAmount ||
      vaultPostTokenBalance.uiTokenAmount.uiAmount -
        vaultPreTokenBalance.uiTokenAmount.uiAmount <
        credits * 0.01
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid transaction: insufficient transfer amount ${
          vaultPostTokenBalance?.uiTokenAmount.uiAmount
        } < ${credits * 0.01}`,
      });
    }

    await prisma.user.update({
      where: { id: address },
      data: {
        credits: user.credits + credits,
      },
    });

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e });
  }
}

export default handler;
