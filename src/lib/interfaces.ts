interface User {
  id: string;
  auth: string;
  credits: number;
}

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
}

export type { User, Message, Thread };