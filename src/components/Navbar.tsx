import { Leaf, HelpCircle, BookOpen, Moon, Sun, PawPrint, Clock, Plus } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleHistory: () => void;
  onHelp: () => void;
  onNewChat: () => void;
}

const Navbar = ({ onToggleSidebar, onToggleHistory, onHelp, onNewChat }: NavbarProps) => {
  const { theme, animalMode, toggleTheme, toggleAnimalMode } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-strong px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${animalMode ? "bg-accent/20" : "gradient-forest"}`}>
            {animalMode ? <PawPrint className="w-5 h-5 text-accent" /> : <Leaf className="w-5 h-5 text-primary-foreground" />}
          </div>
          <div>
            <span className={`text-lg font-bold ${animalMode ? "text-accent" : "text-foreground"}`}>
              {animalMode ? "TB Wildlife" : "TB AI"}
            </span>
            <p className="text-[10px] text-muted-foreground hidden md:block">
              {animalMode ? "Wildlife Conservation" : "Environmental Intelligence"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onNewChat}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title="New Chat (Ctrl+N)"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={toggleAnimalMode}
            className={`p-2 rounded-lg transition-colors ${animalMode ? "bg-accent/20 text-accent" : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"}`}
            title="Toggle Animal Mode (Ctrl+Shift+A)"
          >
            <PawPrint className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title="Toggle Theme (Ctrl+Shift+O)"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onHelp}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title="Browse Topics"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleHistory}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title="Chat History (Ctrl+H)"
          >
            <Clock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
