// Component Imports
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Image Imports
import logo from '@/images/supergpt-sm.svg';
import plus from '@/images/plus.svg';


// Styles Imports
import styles from '@/styles/LoggedIn.module.scss';

function LoggedInPage() {
  const [model, setModel] = useState<3.5|4.0>(3.5);

  function handleModelChange(_model: 3.5|4.0) {
    setModel(_model);
    localStorage.setItem('model', _model.toString());
  }

  useEffect(() => {
    const localModel = localStorage.getItem('model');
    if (localModel && typeof localModel === 'string') {
      const parsedModel = parseFloat(localModel);
      if (parsedModel !== 3.5 && parsedModel !== 4.0) return;
      setModel(parsedModel);
    }
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src={logo} alt="SuperGPT Logo" />
        </div>
        <button className={styles.newChat}>
          <Image src={plus} alt="" />
          {"NEW CHAT"}
        </button>
        {/* Add Recent Threads */}
        {/* Add Profile Pane */}
      </div>

      <div className={styles.content}>
        <div className={styles.modelSelection}>
          <button
            onClick={() => handleModelChange(3.5)}
            className={styles.modelButton + (model === 3.5 ? ` ${styles.active}` : '')}
          >
            {"GPT 3.5"}
          </button>
          <button
            onClick={() => handleModelChange(4.0)}
            className={styles.modelButton + (model === 4.0 ? ` ${styles.active}` : '')}
          >
            {"GPT 4.0"}
          </button>
        </div>

        <div className={styles.chatsComponent}>
          <div className={styles.messages}>
            {/* Load and map a thread here to the Messages components */}
          </div>
          <div className={styles.chatBox}>
            {/* Add a chat box here */}
          </div>
        </div>

      </div>

    </main>
  );
}

export { LoggedInPage };