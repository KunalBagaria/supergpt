import Image from 'next/image';
import logo from '@/images/supergpt-lg.svg';
import chat from '@/images/chat.svg';
import styles from '@/styles/LoggedOut.module.scss';

import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { ConnectWallet } from './wallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserSignature } from "@/lib/signMessage";
import { handleRegisterRequest } from '@/lib/networkRequests';

function LoggedOutPage() {
  const wallet = useWallet();
  const [clicked, setClicked] = useState(false);

  async function handleRegister() {
    if (!wallet.signMessage || !wallet.publicKey) return;
    const signature = await getUserSignature(wallet.signMessage);
    if (!signature) return;
    const request = handleRegisterRequest(wallet.publicKey.toBase58(), signature);
    toast.promise(request, {
      loading: "Signing in",
      success: "You're signed in",
      error: "Error signing in"
    });
    const data = await request;
    console.log(data);
    if (data.success) {
      const modifiedUser = { ...data.user, auth: signature };
      localStorage.setItem('user', JSON.stringify(modifiedUser));
    }
  }

  useEffect(() => {
    if (clicked) handleRegister();
  }, [clicked, wallet.publicKey]);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <Image src={logo} alt="SuperGPT" />
          <p>{"An anonymous, simpler and better version of ChatGPT"}</p>
          <ConnectWallet noToast={true}>
            <button onClick={() => setClicked(!clicked)} className={styles.connect}>
              {"CONTINUE WITH WALLET"}
            </button>
          </ConnectWallet>
        </div>
        <div className={styles.rightSection}>
          <Image src={chat} alt="Chat" />
        </div>
      </div>
    </main>
  );
};

export { LoggedOutPage };