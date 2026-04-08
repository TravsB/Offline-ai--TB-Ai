import { AlertTriangle, BookOpen, BarChart3 } from "lucide-react";

interface FloatingActionsProps {
  onEmergency: () => void;
  onToggleSidebar: () => void;
}

const FloatingActions = ({ onEmergency, onToggleSidebar }: FloatingActionsProps) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
      <button
        onClick={onEmergency}
        className="w-12 h-12 rounded-xl gradient-sunset text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
        title="Report Emergency"
      >
        <AlertTriangle className="w-5 h-5" />
      </button>
      <button
        onClick={onToggleSidebar}
        className="hidden md:flex w-12 h-12 rounded-xl gradient-forest text-primary-foreground items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="Browse Topics"
      >
        <BookOpen className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FloatingActions;
