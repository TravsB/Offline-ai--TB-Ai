import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import TopicSidebar from "@/components/TopicSidebar";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import EmergencyModal from "@/components/EmergencyModal";
import FloatingActions from "@/components/FloatingActions";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const { animalMode } = useTheme();

  const {
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
  } = useChatHistory();

  const handleSelectTopic = useCallback((topicId: string) => {
    const text = topicId.replace(/-/g, " ");
    // Create a new conversation with this topic
    const id = createNew(animalMode);
    addMessage(id, { role: "user", content: `Tell me about ${text}`, timestamp: Date.now() });
  }, [createNew, addMessage, animalMode]);

  const handleHelp = useCallback(() => {
    const id = createNew(animalMode);
    addMessage(id, { role: "user", content: "What can you help me with? Show me all your features.", timestamp: Date.now() });
  }, [createNew, addMessage, animalMode]);

  const handleNewChat = useCallback(() => {
    createNew(animalMode);
  }, [createNew, animalMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (meta && e.shiftKey && key === "o") {
        e.preventDefault();
        // Theme toggle handled by ThemeProvider
      }
      if (meta && key === "h") {
        e.preventDefault();
        setHistoryOpen((o) => !o);
      }
      if (meta && key === "n") {
        e.preventDefault();
        handleNewChat();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleNewChat]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute w-64 h-64 rounded-full blur-3xl -top-20 -left-20 animate-float ${animalMode ? "bg-accent/5" : "bg-primary/5"}`} />
        <div className={`absolute w-48 h-48 rounded-full blur-3xl bottom-1/4 right-1/4 animate-float ${animalMode ? "bg-sunset/5" : "bg-ocean/5"}`} style={{ animationDelay: "-3s" }} />
        <div className="absolute w-72 h-72 rounded-full bg-accent/3 blur-3xl top-1/3 right-0 animate-float" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(true)}
          onToggleHistory={() => setHistoryOpen(true)}
          onHelp={handleHelp}
          onNewChat={handleNewChat}
        />

        <main className="flex-1 overflow-hidden">
          <ChatInterface
            conversation={currentConversation}
            onAddMessage={addMessage}
            onUpdateLastAssistant={updateLastAssistant}
            onCreateNew={createNew}
          />
        </main>
      </div>

      <TopicSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectTopic={handleSelectTopic}
      />

      <ChatHistorySidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        conversations={conversations}
        currentId={currentId}
        onSelect={selectConversation}
        onNew={handleNewChat}
        onDelete={deleteConversation}
        onRename={renameConversation}
        onClearAll={clearAll}
      />

      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />

      <FloatingActions
        onEmergency={() => setEmergencyOpen(true)}
      />
    </div>
  );
};

export default Index;
