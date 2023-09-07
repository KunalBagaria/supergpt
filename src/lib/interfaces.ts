interface User {
  id: string;
  auth: string;
  credits: number;
}

interface Message {
  content: string;
  role: "user" | "assistant";
}

interface SavedMessage extends Message {
  id: number;
}

interface Thread {
  id: number;
  title: string;
  messages: SavedMessage[];
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  prompt: string;
}

export type { User, Message, SavedMessage, Thread };
