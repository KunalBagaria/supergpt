import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "@/styles/LoggedIn.module.scss";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import toast from "react-hot-toast";
import { handleBuyCreditsRequest } from "@/lib/networkRequests";
import { getLocalSignature } from "@/lib/signMessage";
import useUser from "@/hooks/useUser";

const BuyCreditsDialog = () => {
  const [credits, setCredits] = useState(1000);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { refetch } = useUser();

  const handleCheckout = async () => {
    const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS;

    if (!vaultAddress) return;

    const signature = getLocalSignature();
    if (!signature) return;

    if (!publicKey) {
      return alert("Please connect your wallet");
    }

    toast.promise(
      handleBuyCreditsRequest(
        publicKey.toBase58(),
        signature,
        credits,
        publicKey,
        sendTransaction,
        connection,
        vaultAddress
      ),
      {
        loading: "Buying credits",
        success: () => {
          refetch();
          return "Credits bought";
        },
        error: "Error buying credits",
      }
    );
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className={styles.styledButton}>Buy Credits</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>
            Buy Credits
          </Dialog.Title>
          <fieldset className={styles.fieldSet}>
            <label className={styles.fieldLabel} htmlFor="credits">
              No. of credits
            </label>
            <input
              id="credits"
              type="number"
              className={styles.fieldInput}
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value))}
            />
          </fieldset>

          <p>
            Chats are dynamically billed at 1 credit per 1000 characters for
            GPT-3.5 chats and 25 credits per 1000 characters for GPT-4.0 chats.
          </p>

          <p style={{ marginTop: "1rem" }}>1 credit costs $0.01.</p>

          <div
            style={{
              display: "flex",
              marginTop: 25,
              justifyContent: "flex-end",
            }}
          >
            <button className={styles.styledButton} onClick={handleCheckout}>
              Buy
            </button>
          </div>
          <Dialog.Close asChild>
            <button className={styles.iconButton} aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BuyCreditsDialog;
