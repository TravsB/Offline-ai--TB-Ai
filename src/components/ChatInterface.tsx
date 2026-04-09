import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Leaf, User, Copy, Check, PawPrint, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamChat } from "@/lib/streamChat";
import { useTheme } from "@/hooks/useTheme";
import type { ChatMessage, Conversation } from "@/hooks/useChatHistory";
import ImpactCalculator from "./ImpactCalculator";

interface ChatInterfaceProps {
  conversation: Conversation | null;
  onAddMessage: (convId: string, msg: ChatMessage) => void;
  onUpdateLastAssistant: (convId: string, content: string) => void;
  onCreateNew: (animalMode: boolean) => string;
}

const ChatInterface = ({ conversation, onAddMessage, onUpdateLastAssistant, onCreateNew }: ChatInterfaceProps) => {
  const { animalMode } = useTheme();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const messages = conversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation?.id]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");

    let convId = conversation?.id;
    if (!convId) {
      convId = onCreateNew(animalMode);
    }

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: Date.now() };
    onAddMessage(convId, userMsg);

    // Check for calculator
    const lower = text.toLowerCase();
    if (lower.includes("calculator") || lower.includes("calculate") || lower.includes("footprint")) {
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: "@@CALCULATOR@@",
        timestamp: Date.now(),
      };
      onAddMessage(convId, assistantMsg);
      return;
    }

    setIsStreaming(true);
    setStreamContent("");

    const allMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
    let fullContent = "";

    const controller = new AbortController();
    abortRef.current = controller;

    // Add placeholder assistant message
    onAddMessage(convId, { role: "assistant", content: "", timestamp: Date.now() });

    await streamChat({
      messages: allMessages,
      animalMode,
      signal: controller.signal,
      onDelta: (chunk) => {
        fullContent += chunk;
        setStreamContent(fullContent);
        onUpdateLastAssistant(convId!, fullContent);
      },
      onDone: () => {
        setIsStreaming(false);
        setStreamContent("");
        abortRef.current = null;
      },
      onError: (err) => {
        setIsStreaming(false);
        setStreamContent("");
        onUpdateLastAssistant(convId!, `⚠️ Error: ${err}`);
        abortRef.current = null;
      },
    });
  }, [input, isStreaming, conversation, messages, animalMode, onAddMessage, onUpdateLastAssistant, onCreateNew]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(), 50);
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const renderWelcome = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-lg text-center space-y-6">
        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${animalMode ? "bg-accent/20" : "gradient-forest"}`}>
          {animalMode ? <PawPrint className="w-8 h-8 text-accent" /> : <Leaf className="w-8 h-8 text-primary-foreground" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {animalMode ? "TB Wildlife AI" : "TB AI"}
          </h2>
          <p className="text-muted-foreground">
            {animalMode
              ? "Your wildlife conservation intelligence assistant. Ask me about animals, habitats, and conservation."
              : "Your environmental intelligence assistant powered by real AI. Ask me anything about the environment."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {(animalMode
            ? [
                { label: "Endangered Species", icon: "🦁" },
                { label: "Marine Life", icon: "🐋" },
                { label: "Bird Migration", icon: "🦅" },
                { label: "Rainforest Animals", icon: "🐒" },
              ]
            : [
                { label: "Climate Change", icon: "🌍" },
                { label: "Ocean Conservation", icon: "🌊" },
                { label: "Renewable Energy", icon: "⚡" },
                { label: "Impact Calculator", icon: "📊" },
              ]
          ).map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setInput(item.label);
              }}
              className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-muted/50 transition-all group hover:-translate-y-0.5 text-left"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        renderWelcome()
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
            >
              <div className="max-w-[85%] md:max-w-[75%]">
                <div className="flex items-start gap-2">
                  {msg.role === "assistant" && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${animalMode ? "bg-accent/20" : "gradient-forest"}`}>
                      {animalMode ? <PawPrint className="w-3.5 h-3.5 text-accent" /> : <Leaf className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 relative group ${
                      msg.role === "user"
                        ? `${animalMode ? "bg-accent" : "gradient-forest"} text-primary-foreground rounded-br-md`
                        : "glass rounded-bl-md"
                    }`}
                  >
                    {msg.content === "@@CALCULATOR@@" ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-accent" />
                          <span className="font-semibold text-foreground">Impact Calculator</span>
                        </div>
                        <ImpactCalculator />
                      </div>
                    ) : msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_li]:mb-0.5 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_strong]:text-foreground [&_a]:text-primary">
                        <ReactMarkdown>{msg.content || (isStreaming && idx === messages.length - 1 ? "..." : "")}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}

                    {msg.role === "assistant" && msg.content && msg.content !== "@@CALCULATOR@@" && (
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/50"
                        title="Copy"
                      >
                        {copiedId === idx ? (
                          <Check className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className={`text-[10px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right mr-9" : "ml-9"}`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isStreaming && messages[messages.length - 1]?.content === "" && (
            <div className="flex justify-start animate-slide-in">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${animalMode ? "bg-accent/20" : "gradient-forest"}`}>
                  {animalMode ? <PawPrint className="w-3.5 h-3.5 text-accent" /> : <Leaf className="w-3.5 h-3.5 text-primary-foreground" />}
                </div>
                <div className="glass rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                  <span className="text-xs text-muted-foreground ml-2">
                    {animalMode ? "Researching..." : "Analyzing..."}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className={`flex items-end gap-2 glass rounded-2xl px-3 py-2 ${animalMode ? "border-accent/30" : ""}`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={animalMode ? "Ask about wildlife and animals..." : "Ask about environmental issues..."}
              rows={1}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none py-1.5 max-h-24"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className={`p-2 rounded-xl text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0 ${animalMode ? "bg-accent" : "gradient-forest"}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            TB AI uses real AI • Ctrl+Enter to send • Ctrl+N new chat
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
