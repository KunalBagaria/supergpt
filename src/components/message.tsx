import Image from "next/image";
import styles from '@/styles/LoggedIn.module.scss';;
import { SavedMessage } from "@/lib/interfaces";

import gpt from '@/images/gpt.svg';
import user from '@/images/user.svg';

function MessageComponent({ message }: {
  message: SavedMessage
}) {
  return (
    <div
      style={{ backgroundColor: message.role === 'user' ? 'rgba(238, 233, 253, 0.40)' : 'transparent' }}
      className={styles.message}
    >
      <Image src={message.role === 'user' ? user : gpt} alt="" />
      <p>{message.content}</p>
    </div>
  );
}

export { MessageComponent };