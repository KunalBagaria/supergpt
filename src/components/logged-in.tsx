// Component Imports
import Image from "next/image";
import { useEffect, useState } from "react";
import { trimString } from "@/lib/utils";
import { getLocalSignature, getUserSignature } from "@/lib/signMessage";

// Type Imports
import { Thread, Conversation } from "@/lib/interfaces";

// Image Imports
import logo from "@/images/supergpt-sm.svg";
import plus from "@/images/plus.svg";

// Styles Imports
import styles from "@/styles/LoggedIn.module.scss";
import { handleSendMessageRequest } from "@/lib/networkRequests";
import { useWallet } from "@solana/wallet-adapter-react";
import { MessageComponent } from "./message";
import { nanoid } from "nanoid";
import { saveConversation } from "@/lib/conversations";
import useConversations from "@/hooks/useConversations";
import BuyCreditsDialog from "./buy-credits-dialog";
import useUser from "@/hooks/useUser";
import { PersonIcon } from "@radix-ui/react-icons";
import { truncatePubkey } from "@/lib/truncate";

function LoggedInPage() {
  const wallet = useWallet();

  const [input, setInput] = useState<string>("");

  const [loadingChat, setLoadingChat] = useState<boolean>(false);

  const {
    conversations,
    selectedConversation,
    selectedModel,
    handleModelChange,
    handleNewConversation,
    handleSelectConversation,
    handleUpdateConversation,
  } = useConversations();
  const { user } = useUser();

  // function handleChatChange(content: string, role: "user" | "assistant") {
  //   const message: SavedMessage = {
  //     content,
  //     role,
  //     id: new Date().getTime()
  //   }
  //   if (!selectedThread) {
  //     const thread: Thread = {
  //       id: new Date().getTime(),
  //       title: input,
  //       messages: [message]
  //     }
  //     const toUpdateThreads = [thread, ...threads];
  //     setSelectedThread(thread);
  //     console.log(selectedThread);
  //     setThreads(toUpdateThreads);
  //     localStorage.setItem("threads", JSON.stringify(toUpdateThreads));
  //     return thread;
  //   };
  //   if (selectedThread) {
  //     const threadIndex = threads.findIndex((thread) => thread.id === selectedThread.id);
  //     if (threadIndex === -1) return null;
  //     const updatedThread = threads[threadIndex];
  //     updatedThread.messages.push(message);
  //     const newThreads = [...threads];
  //     newThreads[threadIndex] = updatedThread;
  //     setThreads(newThreads);
  //     setSelectedThread(updatedThread);
  //     localStorage.setItem("threads", JSON.stringify(newThreads));
  //     return updatedThread;
  //   }
  // }

  // async function handleSendMessage() {
  //   if (!input) return;
  //   setInput("");
  //   if (!wallet.publicKey) return;
  //   const signature = await getLocalSignature();
  //   if (!signature) return;
  //   const updatedThread = handleChatChange(input, "user");
  //   if (!updatedThread) return;
  //   const mappedMessages = updatedThread.messages.map((message) => { return { content: message.content, role: message.role } });
  //   const response = await handleSendMessageRequest(
  //     wallet.publicKey.toBase58(),
  //     signature,
  //     model.toString(),
  //     mappedMessages
  //   );
  //   if (!response.success) return;
  //   handleChatChange(response.result.choices[0].message.content, "assistant");
  //   console.log(response);
  // }

  // useEffect(() => {
  //   const localThreads = localStorage.getItem("threads");
  //   if (localThreads && typeof localThreads === "string") {
  //     const parsedThreads = JSON.parse(localThreads);
  //     if (!Array.isArray(parsedThreads)) return;
  //     setThreads(parsedThreads);
  //   }
  // }, []);

  const handleSendMessage = async () => {
    if (!input) return;
    setInput("");
    if (!wallet.publicKey) return;
    const signature = getLocalSignature();
    if (!signature) return;
    if (!selectedConversation) return;
    if (!selectedModel) return;

    handleUpdateConversation({
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        { content: input, role: "user" },
      ],
    });

    setLoadingChat(true);

    const response = await handleSendMessageRequest(
      wallet.publicKey.toBase58(),
      signature,
      selectedModel,
      [
        ...selectedConversation.messages.map((message) => {
          return { content: message.content, role: message.role };
        }),
        {
          content: input,
          role: "user",
        },
      ]
    );

    if (!response.success) return;

    handleUpdateConversation({
      ...selectedConversation,
      name: (selectedConversation.name = "New Conversation"
        ? input
        : selectedConversation.name),
      messages: [
        ...selectedConversation.messages,
        {
          content: input,
          role: "user",
        },
        {
          content: response.result.choices[0].message.content,
          role: "assistant",
        },
      ],
    });

    setLoadingChat(false);
  };

  return (
    <main className={styles.main}>
      <div className={styles.sidebarPlaceholder} />
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src={logo} alt="SuperGPT Logo" />
        </div>

        <button
          onClick={() => handleNewConversation()}
          className={styles.newChat}
        >
          <Image src={plus} alt="" />
          {"NEW CHAT"}
        </button>

        <div className={styles.recentThreads}>
          <p className={styles.recentThreadsTitle}>{"Recent Threads"}</p>
          {conversations.map((conversation, index) => (
            <div
              onClick={() => handleSelectConversation(conversation)}
              key={index}
              className={styles.recentThread}
              style={{
                background:
                  selectedConversation?.id === conversation.id
                    ? "var(--light-purple)"
                    : "",
              }}
            >
              <p className={styles.recentThreadName}>
                {trimString(conversation.name, 40)}
              </p>
            </div>
          ))}
        </div>

        {user && (
          <div className={styles.profilePane}>
            {/* <p>Credits available: {user?.credits}</p>
          <BuyCreditsDialog /> */}
            <PersonIcon className={styles.profileIcon} />
            <div className={styles.profileDetails}>
              <p className={styles.profileAddress}>
                {truncatePubkey(user?.id)}
              </p>
              <p>{user?.credits} credits</p>
            </div>
            <BuyCreditsDialog />
          </div>
        )}
      </div>

      {selectedConversation ? (
        <div className={styles.content}>
          <div className={styles.modelSelection}>
            <button
              onClick={() => handleModelChange(3.5)}
              className={
                styles.modelButton +
                (selectedModel === "3.5" ? ` ${styles.active}` : "")
              }
            >
              {"GPT 3.5"}
            </button>
            <button
              onClick={() => handleModelChange(4.0)}
              className={
                styles.modelButton +
                (selectedModel === "4.0" ? ` ${styles.active}` : "")
              }
            >
              {"GPT 4.0"}
            </button>
          </div>

          <div className={styles.chatsComponent}>
            <div className={styles.messages}>
              {selectedConversation?.messages.map((message, index) => (
                <MessageComponent key={index} message={message} />
              ))}
            </div>

            {loadingChat && (
              <div className={styles.loadingChat}>
                <p>{"Loading..."}</p>
              </div>
            )}

            <div className={styles.chatBox}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={styles.chatField}
                placeholder="Send a message"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button className={styles.sendButton}>{"Send"}</button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.noConversation}>
          <p>{"Select a conversation or start a new one to start chatting"}</p>
        </div>
      )}
    </main>
  );
}

export { LoggedInPage };
