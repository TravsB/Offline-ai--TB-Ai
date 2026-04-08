import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import TopicSidebar from "@/components/TopicSidebar";
import EmergencyModal from "@/components/EmergencyModal";
import FloatingActions from "@/components/FloatingActions";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [externalMessage, setExternalMessage] = useState<string | null>(null);

  const handleSelectTopic = useCallback((topicId: string) => {
    setExternalMessage(topicId.replace(/-/g, " "));
  }, []);

  const handleHelp = useCallback(() => {
    setExternalMessage("help");
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl -top-20 -left-20 animate-float" />
        <div className="absolute w-48 h-48 rounded-full bg-ocean/5 blur-3xl bottom-1/4 right-1/4 animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute w-72 h-72 rounded-full bg-accent/3 blur-3xl top-1/3 right-0 animate-float" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(true)}
          onHelp={handleHelp}
        />

        <main className="flex-1 overflow-hidden">
          <ChatInterface
            externalMessage={externalMessage}
            onExternalMessageHandled={() => setExternalMessage(null)}
          />
        </main>
      </div>

      <TopicSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectTopic={handleSelectTopic}
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
