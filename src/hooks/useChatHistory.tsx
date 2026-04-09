import { useState, useCallback } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  date: string;
  animalMode: boolean;
}

const STORAGE_KEY = "tb_ai_conversations";

function loadConversations(): Conversation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveConversations(convos: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [currentId, setCurrentId] = useState<string | null>(() => {
    const convos = loadConversations();
    return convos.length > 0 ? convos[0].id : null;
  });

  const persist = useCallback((convos: Conversation[]) => {
    setConversations(convos);
    saveConversations(convos);
  }, []);

  const currentConversation = conversations.find((c) => c.id === currentId) || null;

  const createNew = useCallback((animalMode = false) => {
    const id = Date.now().toString();
    const newConv: Conversation = {
      id,
      title: "New Conversation",
      messages: [],
      date: new Date().toLocaleDateString(),
      animalMode,
    };
    const updated = [newConv, ...conversations];
    persist(updated);
    setCurrentId(id);
    return id;
  }, [conversations, persist]);

  const addMessage = useCallback((convId: string, msg: ChatMessage) => {
    const updated = conversations.map((c) => {
      if (c.id !== convId) return c;
      const messages = [...c.messages, msg];
      const title = messages.length === 1 && msg.role === "user"
        ? msg.content.substring(0, 40) + (msg.content.length > 40 ? "..." : "")
        : c.title;
      return { ...c, messages, title };
    });
    persist(updated);
  }, [conversations, persist]);

  const updateLastAssistant = useCallback((convId: string, content: string) => {
    const updated = conversations.map((c) => {
      if (c.id !== convId) return c;
      const msgs = [...c.messages];
      const lastIdx = msgs.length - 1;
      if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
        msgs[lastIdx] = { ...msgs[lastIdx], content };
      } else {
        msgs.push({ role: "assistant", content, timestamp: Date.now() });
      }
      return { ...c, messages: msgs };
    });
    persist(updated);
  }, [conversations, persist]);

  const deleteConversation = useCallback((id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    persist(updated);
    if (currentId === id) {
      setCurrentId(updated.length > 0 ? updated[0].id : null);
    }
  }, [conversations, currentId, persist]);

  const renameConversation = useCallback((id: string, title: string) => {
    const updated = conversations.map((c) => (c.id === id ? { ...c, title } : c));
    persist(updated);
  }, [conversations, persist]);

  const clearAll = useCallback(() => {
    persist([]);
    setCurrentId(null);
  }, [persist]);

  const selectConversation = useCallback((id: string) => {
    setCurrentId(id);
  }, []);

  return {
    conversations,
    currentId,
    currentConversation,
    createNew,
    addMessage,
    updateLastAssistant,
    deleteConversation,
    renameConversation,
    clearAll,
    selectConversation,
  };
}
