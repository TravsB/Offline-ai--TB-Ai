import { useState, useRef, useEffect } from "react";
import { Send, Leaf, User, AlertTriangle, Lightbulb, Users, Brain, Search, Globe, Cog, BookOpen, Calculator } from "lucide-react";
import { environmentalDatabase, keywordMatches, type TopicData } from "@/data/environmentalDatabase";
import ImpactCalculator from "./ImpactCalculator";

interface Message {
  id: string;
  content: React.ReactNode;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  externalMessage?: string | null;
  onExternalMessageHandled?: () => void;
}

const ChatInterface = ({ externalMessage, onExternalMessageHandled }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasLoadedWelcome = useRef(false);

  useEffect(() => {
    if (!hasLoadedWelcome.current) {
      hasLoadedWelcome.current = true;
      addBotMessage(createWelcomeMessage());
    }
  }, []);

  useEffect(() => {
    if (externalMessage) {
      processMessage(externalMessage);
      onExternalMessageHandled?.();
    }
  }, [externalMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (content: React.ReactNode) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), content, isUser: false, timestamp: new Date() }]);
  };

  const processMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), content: text, isUser: true, timestamp: new Date() }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = generateResponse(text);
      addBotMessage(response);
    }, 800 + Math.random() * 600);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    processMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string) => {
    processMessage(action);
  };

  const generateResponse = (text: string): React.ReactNode => {
    const lower = text.toLowerCase();

    // Check for calculator request
    if (lower.includes("calculator") || lower.includes("calculate") || lower.includes("footprint") || lower.includes("impact calculator")) {
      return (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-accent" />
            <span className="font-semibold text-foreground">Environmental Impact Calculator</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Calculate your environmental impact across carbon, water, and waste.</p>
          <ImpactCalculator />
        </div>
      );
    }

    // Check for help
    if (lower.includes("help") || lower === "?") {
      return createHelpMessage();
    }

    // Check for stats
    if (lower.includes("stats") || lower.includes("statistics") || lower.includes("data") || lower.includes("numbers")) {
      return createStatsMessage();
    }

    // Check exact topic matches
    for (const [topic, data] of Object.entries(environmentalDatabase)) {
      if (lower.includes(topic.replace(/-/g, " ")) || lower.includes(topic.replace(/-/g, ""))) {
        return createTopicResponse(data);
      }
    }

    // Check keyword matches
    for (const [keyword, topics] of Object.entries(keywordMatches)) {
      if (lower.includes(keyword)) {
        const data = environmentalDatabase[topics[0]];
        if (data) return createTopicResponse(data);
      }
    }

    return createDefaultResponse(text);
  };

  const createWelcomeMessage = (): React.ReactNode => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Leaf className="w-5 h-5 text-primary" />
        <span className="text-lg font-bold text-foreground">Welcome to TB AI</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Your advanced Environmental & Wildlife Intelligence System. Ask me about any environmental topic, or try these quick actions:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Climate Change", icon: "🌍" },
          { label: "Wildlife Protection", icon: "🦁" },
          { label: "Ocean Conservation", icon: "🌊" },
          { label: "Impact Calculator", icon: "📊" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleQuickAction(item.label)}
            className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/30 transition-all text-left group hover:-translate-y-0.5"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const createTopicResponse = (data: TopicData): React.ReactNode => {
    const urgencyColors = {
      low: "bg-primary/20 text-primary",
      medium: "bg-golden/20 text-golden",
      high: "bg-accent/20 text-accent",
      critical: "bg-destructive/20 text-destructive animate-pulse",
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Leaf className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{data.title}</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${urgencyColors[data.urgency]}`}>
            {data.urgency}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          This is a <strong className="text-foreground">{data.urgency}</strong> priority environmental issue requiring attention.
        </p>

        <div className="p-3 rounded-lg bg-accent/5 border-l-2 border-accent">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-accent">Action Plan</span>
          </div>
          <ul className="space-y-1.5">
            {data.solutions.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border-l-2 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">How You Can Help</span>
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Share this information with your community</li>
            <li>• Contact local environmental organizations</li>
            <li>• Support relevant policy changes</li>
            <li>• Adopt sustainable practices daily</li>
          </ul>
        </div>
      </div>
    );
  };

  const createHelpMessage = (): React.ReactNode => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="font-semibold text-foreground">How to Use TB AI</span>
      </div>
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>🌿 <strong className="text-foreground">Ask questions</strong> about any environmental topic</p>
        <p>📊 <strong className="text-foreground">Type "calculator"</strong> to measure your environmental impact</p>
        <p>📋 <strong className="text-foreground">Browse topics</strong> in the sidebar menu</p>
        <p>🚨 <strong className="text-foreground">Report emergencies</strong> with the red button</p>
        <p>📈 <strong className="text-foreground">Type "stats"</strong> to see global environmental data</p>
      </div>
    </div>
  );

  const createStatsMessage = (): React.ReactNode => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-ocean" />
        <span className="font-semibold text-foreground">Global Environmental Statistics</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Temp Rise", value: "+1.1°C", sub: "Since pre-industrial" },
          { label: "CO₂ Level", value: "421 ppm", sub: "Record high" },
          { label: "Species Threatened", value: "41,000+", sub: "IUCN Red List" },
          { label: "Forest Loss", value: "10M ha/yr", sub: "Global average" },
          { label: "Ocean Plastic", value: "12M tons/yr", sub: "Entering oceans" },
          { label: "Wildlife Decline", value: "68%", sub: "Since 1970" },
        ].map((stat) => (
          <div key={stat.label} className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-sm font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground">{stat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const createDefaultResponse = (text: string): React.ReactNode => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary" />
        <span className="font-semibold text-foreground">TB AI Analysis</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Thank you for your question about "<em>{text}</em>". Here's guidance based on environmental science:
      </p>
      <div className="p-3 rounded-lg bg-ocean/5 border-l-2 border-ocean">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-3.5 h-3.5 text-ocean" />
          <span className="text-xs font-semibold text-ocean">Research Steps</span>
        </div>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• Identify local environmental organizations addressing this</li>
          <li>• Research scientific studies and data on the topic</li>
          <li>• Document the problem with evidence</li>
          <li>• Connect with experts in the field</li>
        </ul>
      </div>
      <div className="p-3 rounded-lg bg-primary/5 border-l-2 border-primary">
        <div className="flex items-center gap-2 mb-2">
          <Cog className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Action Planning</span>
        </div>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• Develop short and long-term action plans</li>
          <li>• Identify key stakeholders and partners</li>
          <li>• Create measurable goals and timelines</li>
          <li>• Build community support and awareness</li>
        </ul>
      </div>
      <p className="text-xs text-muted-foreground italic">
        Try browsing specific topics in the sidebar, or ask about climate change, pollution, wildlife, or oceans.
      </p>
    </div>
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"} animate-slide-in`}
          >
            <div className={`max-w-[85%] md:max-w-[75%] ${msg.isUser ? "" : ""}`}>
              <div className="flex items-start gap-2">
                {!msg.isUser && (
                  <div className="w-7 h-7 rounded-lg gradient-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.isUser
                      ? "gradient-forest text-primary-foreground rounded-br-md"
                      : "glass rounded-bl-md"
                  }`}
                >
                  {typeof msg.content === "string" ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.isUser && (
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className={`text-[10px] text-muted-foreground mt-1 ${msg.isUser ? "text-right mr-9" : "ml-9"}`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-slide-in">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-forest flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                <span className="text-xs text-muted-foreground ml-2">Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 glass rounded-2xl px-3 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about environmental issues..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none py-1.5 max-h-24"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl gradient-forest text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
