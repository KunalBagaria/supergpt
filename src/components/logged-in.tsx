// Component Imports
import Image from "next/image";
import { useEffect, useState } from "react";
import { trimString } from "@/lib/utils";
import { getLocalSignature, getUserSignature } from "@/lib/signMessage";

// Type Imports
import { Thread, SavedMessage } from "@/lib/interfaces";

// Image Imports
import logo from "@/images/supergpt-sm.svg";
import plus from "@/images/plus.svg";

// Styles Imports
import styles from "@/styles/LoggedIn.module.scss";
import { handleSendMessageRequest } from "@/lib/networkRequests";
import { useWallet } from "@solana/wallet-adapter-react";

function LoggedInPage() {
  const wallet = useWallet();

  const [model, setModel] = useState<3.5 | 4.0>(3.5);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [input, setInput] = useState<string>("");

  function handleModelChange(_model: 3.5 | 4.0) {
    setModel(_model);
    localStorage.setItem("model", _model.toString());
  }

  async function handleChatChange(content: string, role: "user" | "assistant") {
    const message: SavedMessage = {
      content,
      role,
      id: new Date().getTime()
    }
    if (!selectedThread) {
      const thread: Thread = {
        id: new Date().getTime(),
        title: input,
        messages: [message]
      }
      const toUpdateThreads = [thread, ...threads];
      setSelectedThread(thread);
      setThreads(toUpdateThreads);
      localStorage.setItem("threads", JSON.stringify(toUpdateThreads));
    };
    if (selectedThread) {
      const threadIndex = threads.findIndex((thread) => thread.id === selectedThread.id);
      if (threadIndex === -1) return;
      const updatedThread = threads[threadIndex];
      updatedThread.messages.push(message);
      const newThreads = [...threads];
      newThreads[threadIndex] = updatedThread;
      setThreads(newThreads);
      setSelectedThread(updatedThread);
      localStorage.setItem("threads", JSON.stringify(newThreads));
    }
  }

  async function handleSendMessage() {
    if (!wallet.publicKey) return;
    const signature = await getLocalSignature();
    if (!signature) return;
    handleChatChange(input, "user");
    if (!selectedThread) return;
    const mappedMessages = selectedThread.messages.map((message) => { return { content: message.content, role: message.role } });
    const response = await handleSendMessageRequest(
      wallet.publicKey.toBase58(),
      signature,
      model.toString(),
      mappedMessages
    );
    if (!response.success) return;
    console.log(response);
  }

  useEffect(() => {
    const localModel = localStorage.getItem("model");
    if (localModel && typeof localModel === "string") {
      const parsedModel = parseFloat(localModel);
      if (parsedModel !== 3.5 && parsedModel !== 4.0) return;
      setModel(parsedModel);
    }
  }, []);

  useEffect(() => {
    const localThreads = localStorage.getItem("threads");
    if (localThreads && typeof localThreads === "string") {
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

        <button
          onClick={() => setSelectedThread(null)}
          className={styles.newChat}
        >
          <Image src={plus} alt="" />
          {"NEW CHAT"}
        </button>

        <div className={styles.recentThreads}>
          <p className={styles.recentThreadsTitle}>{"Recent Threads"}</p>
          {threads.map((thread, index) => (
            <div
              onClick={() => setSelectedThread(thread)}
              key={index}
              className={styles.recentThread}
            >
              <p className={styles.recentThreadName}>
                {trimString(thread.title, 50)}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.profilePane}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.modelSelection}>
          <button
            onClick={() => handleModelChange(3.5)}
            className={
              styles.modelButton + (model === 3.5 ? ` ${styles.active}` : "")
            }
          >
            {"GPT 3.5"}
          </button>
          <button
            onClick={() => handleModelChange(4.0)}
            className={
              styles.modelButton + (model === 4.0 ? ` ${styles.active}` : "")
            }
          >
            {"GPT 4.0"}
          </button>
        </div>

        <div className={styles.chatsComponent}>
          <div className={styles.messages}>
          </div>

          <div className={styles.chatBox}>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              className={styles.chatField}
              placeholder="Send a message"
            />
            <button onClick={handleSendMessage} className={styles.sendButton}>{"Send"}</button>
          </div>

        </div>
      </div>
    </main>
  );
}

export { LoggedInPage };
