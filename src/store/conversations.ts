import { atomWithStorage } from "jotai/utils";
import { Conversation } from "@/lib/interfaces";

export const conversationsAtom = atomWithStorage<Conversation[]>(
  "conversationHistory",
  []
);

export const selectedConversationAtom = atomWithStorage<Conversation | null>(
  "selectedConversation",
  null
);

export const selectedModelAtom = atomWithStorage<string | null>(
  "selectedModel",
  "3.5"
);
