import { Leaf, Menu, HelpCircle } from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
  onHelp: () => void;
}

const Navbar = ({ onToggleSidebar, onHelp }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 glass-strong px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-forest flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">TB AI</span>
          <span className="hidden md:inline text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
            Environmental Intelligence
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onHelp}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
