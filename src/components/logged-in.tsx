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
import toast from "react-hot-toast";

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
  const { user, refetch } = useUser();

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

    if (user.credits < 1) {
      return toast.error("You don't have enough credits");
    }

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

    await refetch();

    if (!response.success) return;

    handleUpdateConversation({
      ...selectedConversation,
      name:
        selectedConversation.name == "New Conversation"
          ? input
          : selectedConversation.name,
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
            <div className={styles.profileUser}>
              <svg
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.profileIcon}
              >
                <g
                  stroke="#6f47eb"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="m20 21v-2c0-1.0609-.4214-2.0783-1.1716-2.8284-.7501-.7502-1.7675-1.1716-2.8284-1.1716h-8c-1.06087 0-2.07828.4214-2.82843 1.1716-.75014.7501-1.17157 1.7675-1.17157 2.8284v2" />
                  <path d="m12 11c2.2091 0 4-1.79086 4-4s-1.7909-4-4-4c-2.20914 0-4 1.79086-4 4s1.79086 4 4 4z" />
                </g>
              </svg>
              <div className={styles.profileDetails}>
                <p className={styles.profileAddress}>
                  {truncatePubkey(user?.id)}
                </p>
                <p className={styles.profileCredits}>{user?.credits} credits</p>
              </div>
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
                (selectedModel === "4" ? ` ${styles.active}` : "")
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
