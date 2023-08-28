import { SavedMessage } from "@/lib/interfaces";

import styles from '@/styles/LoggedIn.module.scss';;

function MessageComponent({ message }: {
  message: SavedMessage
}) {
  return (
    <div className={styles.message}>
      <p>{message.content}</p>
    </div>
  );
}

export { MessageComponent };