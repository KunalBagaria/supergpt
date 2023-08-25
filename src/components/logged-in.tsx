// Component Imports
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { trimString } from '@/lib/utils';

// Type Imports
import { Thread, Message } from '@/lib/interfaces';

// Image Imports
import logo from '@/images/supergpt-sm.svg';
import plus from '@/images/plus.svg';


// Styles Imports
import styles from '@/styles/LoggedIn.module.scss';

function LoggedInPage() {
  const [model, setModel] = useState<3.5|4.0>(3.5);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread|null>(null);

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

  useEffect(() => {
    const localThreads = localStorage.getItem('threads');
    if (localThreads && typeof localThreads === 'string') {
      const parsedThreads = JSON.parse(localThreads);
      if (!Array.isArray(parsedThreads)) return;
      setThreads(parsedThreads);
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

        <div className={styles.recentThreads}>
          <p className={styles.recentThreadsTitle}>{"Recent Threads"}</p>
          {threads.map((thread, index) => (
            <div
              onClick={() => setSelectedThread(thread)}
              key={index} className={styles.recentThread}
            >
              <p className={styles.recentThreadName}>{trimString(thread.title, 50)}</p>
            </div>
          ))}
        </div>

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