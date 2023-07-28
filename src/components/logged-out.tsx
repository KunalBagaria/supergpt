import Image from 'next/image';
import logo from '@/images/supergpt-lg.svg';
import chat from '@/images/chat.svg';
import styles from '@/styles/LoggedOut.module.scss';

function LoggedOutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <Image src={logo} alt="SuperGPT" />
          <p>{"Please connect your wallet to continue"}</p>
          <button className={styles.connect}>{"CONNECT WALLET AND REGISTER"}</button>
        </div>
        <div className={styles.rightSection}>
          <Image src={chat} alt="Chat" />
        </div>
      </div>
    </main>
  );
};

export { LoggedOutPage };