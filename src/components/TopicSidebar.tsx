import { X, Search, CloudSun, Factory, Trees, Bird, Waves, Wheat, Zap } from "lucide-react";
import { useState } from "react";
import { topicCategories } from "@/data/environmentalDatabase";

const iconMap: Record<string, React.ReactNode> = {
  "cloud-sun": <CloudSun className="w-4 h-4" />,
  factory: <Factory className="w-4 h-4" />,
  trees: <Trees className="w-4 h-4" />,
  bird: <Bird className="w-4 h-4" />,
  waves: <Waves className="w-4 h-4" />,
  wheat: <Wheat className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
};

interface TopicSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
}

const TopicSidebar = ({ isOpen, onClose, onSelectTopic }: TopicSidebarProps) => {
  const [search, setSearch] = useState("");

  const filteredCategories = topicCategories.map((cat) => ({
    ...cat,
    topics: Object.fromEntries(
      Object.entries(cat.topics).filter(([, name]) =>
        name.toLowerCase().includes(search.toLowerCase())
      )
    ),
  })).filter((cat) => Object.keys(cat.topics).length > 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-80 md:w-72 glass-strong z-50 transform transition-transform duration-300 ease-out overflow-hidden flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="font-semibold text-foreground text-sm">Environmental Topics</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-accent uppercase tracking-wider">
                {iconMap[category.icon]}
                <span>{category.name}</span>
              </div>
              <div className="space-y-0.5">
                {Object.entries(category.topics).map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => {
                      onSelectTopic(id);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 hover:translate-x-1"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default TopicSidebar;
