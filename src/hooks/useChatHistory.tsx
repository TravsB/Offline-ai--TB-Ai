import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id?: string;
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

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load conversations from Supabase on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all conversations ordered by updated_at
      const { data: convosData, error: convosError } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (convosError) throw convosError;

      // Fetch all messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      // Map messages to conversations
      const loadedConvos: Conversation[] = (convosData || []).map((conv) => ({
        id: conv.id,
        title: conv.title,
        animalMode: conv.animal_mode,
        date: new Date(conv.created_at).toLocaleDateString(),
        messages: (messagesData || [])
          .filter((msg) => msg.conversation_id === conv.id)
          .map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            timestamp: new Date(msg.created_at).getTime(),
          })),
      }));

      setConversations(loadedConvos);
      
      // Set current conversation to the most recent one if available
      if (loadedConvos.length > 0 && !currentId) {
        setCurrentId(loadedConvos[0].id);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentConversation = conversations.find((c) => c.id === currentId) || null;

  const createNew = useCallback(async (animalMode = false) => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          title: "New Conversation",
          animal_mode: animalMode,
        })
        .select()
        .single();

      if (error) throw error;

      const newConv: Conversation = {
        id: data.id,
        title: data.title,
        messages: [],
        date: new Date(data.created_at).toLocaleDateString(),
        animalMode: data.animal_mode,
      };

      setConversations((prev) => [newConv, ...prev]);
      setCurrentId(data.id);
      return data.id;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      // Fallback to local creation
      const id = crypto.randomUUID();
      const newConv: Conversation = {
        id,
        title: "New Conversation",
        messages: [],
        date: new Date().toLocaleDateString(),
        animalMode,
      };
      setConversations((prev) => [newConv, ...prev]);
      setCurrentId(id);
      return id;
    }
  }, []);

  const addMessage = useCallback(async (convId: string, msg: ChatMessage) => {
    try {
      // Insert message into Supabase
      const { data: messageData, error: msgError } = await supabase
        .from("messages")
        .insert({
          conversation_id: convId,
          role: msg.role,
          content: msg.content,
        })
        .select()
        .single();

      if (msgError) throw msgError;

      // Update local state
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const messages = [...c.messages, { ...msg, id: messageData.id }];
          
          // Update title if this is the first user message
          let title = c.title;
          if (messages.length === 1 && msg.role === "user") {
            title = msg.content.substring(0, 40) + (msg.content.length > 40 ? "..." : "");
            // Update title in Supabase
            supabase
              .from("conversations")
              .update({ title })
              .eq("id", convId)
              .then();
          }
          
          return { ...c, messages, title };
        })
      );
    } catch (error) {
      console.error("Failed to add message:", error);
      // Fallback to local update
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const messages = [...c.messages, msg];
          const title =
            messages.length === 1 && msg.role === "user"
              ? msg.content.substring(0, 40) + (msg.content.length > 40 ? "..." : "")
              : c.title;
          return { ...c, messages, title };
        })
      );
    }
  }, []);

  const updateLastAssistant = useCallback(async (convId: string, content: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const msgs = [...c.messages];
        const lastIdx = msgs.length - 1;
        
        if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
          // Update existing assistant message
          const msgId = msgs[lastIdx].id;
          msgs[lastIdx] = { ...msgs[lastIdx], content };
          
          // Update in Supabase if we have an ID
          if (msgId) {
            supabase
              .from("messages")
              .update({ content })
              .eq("id", msgId)
              .then();
          }
        } else {
          // Create new assistant message
          const newMsg: ChatMessage = { role: "assistant", content, timestamp: Date.now() };
          msgs.push(newMsg);
          
          // Insert into Supabase
          supabase
            .from("messages")
            .insert({
              conversation_id: convId,
              role: "assistant",
              content,
            })
            .select()
            .single()
            .then(({ data }) => {
              if (data) {
                // Update the message with the ID from Supabase
                setConversations((current) =>
                  current.map((conv) => {
                    if (conv.id !== convId) return conv;
                    const updatedMsgs = conv.messages.map((m, idx) =>
                      idx === conv.messages.length - 1 && m.role === "assistant"
                        ? { ...m, id: data.id }
                        : m
                    );
                    return { ...conv, messages: updatedMsgs };
                  })
                );
              }
            });
        }
        
        return { ...c, messages: msgs };
      })
    );
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setConversations((prev) => prev.filter((c) => c.id !== id));
      
      if (currentId === id) {
        setCurrentId((prev) => {
          const remaining = conversations.filter((c) => c.id !== id);
          return remaining.length > 0 ? remaining[0].id : null;
        });
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  }, [currentId, conversations]);

  const renameConversation = useCallback(async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .update({ title })
        .eq("id", id);

      if (error) throw error;

      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
    } catch (error) {
      console.error("Failed to rename conversation:", error);
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      // Delete all conversations (messages will cascade delete)
      const { error } = await supabase
        .from("conversations")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (error) throw error;

      setConversations([]);
      setCurrentId(null);
    } catch (error) {
      console.error("Failed to clear all conversations:", error);
    }
  }, []);

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
    isLoading,
  };
}
