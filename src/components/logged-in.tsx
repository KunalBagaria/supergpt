// Component Imports
import Image from 'next/image';
import { useState } from 'react';

// Image Imports
import logo from '@/images/supergpt-sm.svg';

// Styles Imports
import styles from '@/styles/LoggedIn.module.scss';

function LoggedInPage() {
  const [model, setModel] = useState<3.5|4.0>(3.5);

  function handleModelChange(_model: 3.5|4.0) {
    setModel(_model);
  }

  return (
    <main className={styles.main}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src={logo} alt="SuperGPT Logo" />
        </div>
        {/* Add New Chat Button */}
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
      </div>

    </main>
  );
}

export { LoggedInPage };