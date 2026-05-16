import { Leaf, HelpCircle, BookOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface NavbarProps {
  onToggleSidebar: () => void;
  onHelp: () => void;
}

const Navbar = ({ onToggleSidebar, onHelp }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-strong px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-forest flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">TB</span>
            <p className="text-[10px] text-muted-foreground hidden md:block">
              Environmental Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title="Browse topics"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <button
            onClick={onHelp}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
