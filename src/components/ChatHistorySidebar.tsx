import { X, Search, Plus, Trash2, Edit3, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import type { Conversation } from "@/hooks/useChatHistory";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onClearAll: () => void;
}

const ChatHistorySidebar = ({
  isOpen,
  onClose,
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onClearAll,
}: ChatHistorySidebarProps) => {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filtered = conversations.filter((c) => {
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) ||
      c.messages.some((m) => m.content.toLowerCase().includes(q));
  });

  const startRename = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const submitRename = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this conversation?")) {
      onDelete(id);
    }
  };

  const handleClearAll = () => {
    if (confirm("Clear ALL conversations? This cannot be undone.")) {
      onClearAll();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-80 glass-strong z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground text-sm">Chat History</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-2 border-b border-border/50">
          <button
            onClick={() => { onNew(); onClose(); }}
            className="w-full py-2.5 rounded-xl gradient-forest text-primary-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center text-muted-foreground text-xs py-8">
              {conversations.length === 0 ? "No conversations yet" : "No matches found"}
            </div>
          ) : (
            filtered.map((conv) => (
              <div
                key={conv.id}
                onClick={() => { onSelect(conv.id); onClose(); }}
                className={`p-3 rounded-xl cursor-pointer transition-all group hover:-translate-y-0.5 ${
                  currentId === conv.id
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-muted/20 border border-border/30 hover:bg-muted/40"
                }`}
              >
                {editingId === conv.id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={submitRename}
                    onKeyDown={(e) => e.key === "Enter" && submitRename()}
                    autoFocus
                    className="w-full text-sm font-medium bg-transparent text-foreground focus:outline-none border-b border-primary/50"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">{conv.title}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); startRename(conv); }}
                        className="p-1 rounded hover:bg-muted/60 text-muted-foreground"
                        title="Rename"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                        className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {conv.messages[conv.messages.length - 1]?.content?.substring(0, 80) || "Empty"}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{conv.date}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-border/50 space-y-2">
          {conversations.length > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3 h-3 inline mr-1" />
              Clear All Conversations
            </button>
          )}
          <p className="text-[10px] text-center text-muted-foreground">
            Conversations stored locally on this device
          </p>
        </div>
      </aside>
    </>
  );
};

export default ChatHistorySidebar;
