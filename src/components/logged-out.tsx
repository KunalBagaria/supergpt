import Image from 'next/image';
import logo from '@/images/supergpt-lg.svg';
import chat from '@/images/chat.svg';
import styles from '@/styles/LoggedOut.module.scss';

import { User } from '@/lib/interfaces';
import { useEffect, useState } from 'react';
import { ConnectWallet } from './wallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserSignature } from "@/lib/signMessage";
import { handleRegisterRequest } from '@/lib/networkRequests';

function LoggedOutPage({
  setParentUser
}: {
  setParentUser: (user: User) => void;
}) {
  const wallet = useWallet();
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log(localStorage);
    const user = localStorage.getItem('user');
    if (user && typeof user === 'string') {
      setUser(JSON.parse(user));
    }
  }, []);

  async function handleRegister() {
    if (!wallet.signMessage || !wallet.publicKey) return;
    const signature = await getUserSignature(wallet.signMessage);
    if (!signature) return;
    const data = await handleRegisterRequest(wallet.publicKey.toBase58(), signature);
    console.log(data);
    if (data.success) {
      const modifiedUser = { ...data.user, auth: signature };
      localStorage.setItem('user', JSON.stringify(modifiedUser));
      setUser(modifiedUser);
      setParentUser(modifiedUser);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (clicked && !loading) {
      setLoading(true);
      handleRegister();
    }
  }, [clicked]);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <Image src={logo} alt="SuperGPT" />
          <p>{"Please connect your wallet to continue"}</p>
          <ConnectWallet>
            <button onClick={() => setClicked(!clicked)} className={styles.connect}>
              {"CONNECT WALLET AND REGISTER"}
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