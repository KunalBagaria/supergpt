import { Conversation } from "@/lib/interfaces";
import {
  conversationsAtom,
  selectedConversationAtom,
  selectedModelAtom,
} from "@/store/conversations";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";

const useConversations = () => {
  const [conversations, setConversations] = useAtom(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useAtom(
    selectedConversationAtom
  );
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: nanoid(),
      name: "New Conversation",
      messages: [],
      prompt:
        "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);
  };

  const handleUpdateConversation = (updatedConversation: Conversation) => {
    const updatedConversations = conversations.map((c) => {
      if (c.id === updatedConversation.id) {
        return updatedConversation;
      }
      return c;
    });

    setSelectedConversation(updatedConversation);
    setConversations(updatedConversations);
  };

  const handleModelChange = (model: 3.5 | 4.0) => {
    setSelectedModel(model.toString());
  };

  return {
    conversations,
    selectedConversation,
    selectedModel,
    handleSelectConversation,
    handleNewConversation,
    handleUpdateConversation,
    handleModelChange,
  };
};

export default useConversations;
