import create from "zustand";

export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
};

type ChatState = {
  messages: Message[];
  assistantId: string | null;
  generating: boolean;
  offset: number;

  add: (msg: Message) => void;
  start: (id: string) => void;
  stop: () => void;
  updateContent: (id: string, updater: (prev: string) => string) => void;
};

export const useChat = create<ChatState>((set) => ({
  messages: [],
  assistantId: null,
  generating: false,
  offset: 0,

  add: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
      assistantId: msg.role === "assistant" ? msg.id : state.assistantId,
    })),

  start: (id) =>
    set((state) => ({
      generating: true,
      assistantId: id,
      offset: state.assistantId === id ? state.offset : 0,
    })),

  stop: () =>
    set(() => ({
      generating: false,
    })),

  updateContent: (id, updater) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content: updater(msg.content) } : msg,
      ),
    })),
}));
